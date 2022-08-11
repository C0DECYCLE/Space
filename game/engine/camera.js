"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Camera {

    config = {

        max: 1 * 1000 * 1000,

        offset: 8,
        lerp: 0.1
    };

    scene = null;
    controls = null;
    root = null;
    camera = null;

    state = new StateMachine();
    target = null;

    originPosition = new BABYLON.Vector3( 0, 0, 0 );
    entityList = [];

    #focusAlpha = -Math.PI / 2;
    #focusBeta = Math.PI / 2;

    constructor( scene, controls, config ) {

        this.scene = scene;
        this.controls = controls;

        this.root = new BABYLON.TransformNode( "camera", this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();

        this.state.add( "player", ( oldState, player ) => this.#onPlayerEnter( oldState, player ), ( newState ) => this.#onPlayerLeave( newState ) );
        this.state.add( "spaceship", ( oldState, spaceship ) => this.#onSpaceshipEnter( oldState, spaceship ), ( newState ) => this.#onSpaceshipLeave( newState ) );

        this.#createCamera();
        this.#originLogic();
    }

    add( entity ) {

        this.entityList.push( entity );
    }

    remove( entity ) {

        this.entityList.remove( entity );
    }

    attachToPlayer( player ) {

        this.state.set( "player", player );
    }

    attachToSpaceship( spaceship ) {

        this.state.set( "spaceship", spaceship );
    }

    focus() {

        this.camera.alpha = BABYLON.Scalar.Lerp( this.camera.alpha, this.#focusAlpha, this.config.lerp );
        this.camera.beta = BABYLON.Scalar.Lerp( this.camera.beta, this.#focusBeta, this.config.lerp );
    }

    free( event ) {

        this.camera.alpha -= event.event.movementX * this.controls.config.panning;
        this.camera.beta -= event.event.movementY * this.controls.config.panning;
    }

    update() {

        if ( this.state.is( "player" ) == true ) {
            
            this.originPosition = BABYLON.Vector3.Lerp( this.originPosition, this.target.entity.originPosition, this.config.lerp );
            this.root.rotationQuaternion = BABYLON.Quaternion.Slerp( this.root.rotationQuaternion, this.target.entity.rotationQuaternion, this.config.lerp );

            if ( this.controls.isKeyboarding == true ) {

                this.focus();
            }
        }
    }

    #createCamera() {

        this.camera = new BABYLON.ArcRotateCamera( "camera_camera", this.#focusAlpha, this.#focusBeta, this.config.offset, BABYLON.Vector3.Zero(), this.scene );
        this.camera.maxZ = this.config.max;
        this.camera.parent = this.root;

        //slower velocity more up & closer -> faster more down behind and further
        //when moving, move into panned camera direction
    }

    #originLogic() {

        this.root.inspectableCustomProperties = [
            {
                label: "Origin Position",
                propertyName: "originPosition",
                type: BABYLON.InspectableType.Vector3,
            }
        ];

        this.scene.onBeforeActiveMeshesEvaluationObservable.add( () => {
            
            this.root.originPosition = this.originPosition; //only for inspector, no logic!

            for ( let i = 0; i < this.entityList.length; i++ ) {
                
                this.entityList[i].originUpdate();
            }
        } );
    }

    #onPlayerEnter( oldState, player ) {

        log( "camera attached to player" );

        this.target = player;
    }

    #onPlayerLeave( newState ) {
        
        log( "camera detached from player" );
    }
    
    #onSpaceshipEnter( oldState, spaceship ) {
        
        log( "camera attached to spaceship" );
        
        this.target = spaceship;
    }
    
    #onSpaceshipLeave( newState ) {
        
        log( "camera detached from spaceship" );
    }

}