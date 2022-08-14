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
        lerp: 0.1,

        physicsRadius: 200
    };

    manager = null;
    scene = null;
    controls = null;
    
    root = null;
    camera = null;

    state = new StateMachine();
    target = null;

    origin = null;

    #focusAlpha = -Math.PI / 2;
    #focusBeta = Math.PI / 2;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;
        this.controls = this.manager.controls;

        this.config.max = config.max || this.config.max;
        this.config.offset = config.offset || this.config.offset;
        this.config.lerp = config.lerp || this.config.lerp;
        this.config.physicsRadius = config.physicsRadius || this.config.physicsRadius;

        this.#createRoot();
        this.#setupStates();
        this.#createCamera();
        this.#addOrigin();
    }

    get position() {
        
        return this.origin.actualPosition;
    }

    get rotationQuaternion() {
        
        return this.root.rotationQuaternion;
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
            
            this.#syncWithTarget( this.target );

            if ( this.controls.isKeyboarding == true ) {

                this.focus();
            }
        }
    }

    #createRoot() {

        this.root = new BABYLON.TransformNode( "camera", this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    #setupStates() {

        this.state.add( "player", ( oldState, player ) => this.#onPlayerEnter( oldState, player ), ( newState ) => this.#onPlayerLeave( newState ) );
        this.state.add( "spaceship", ( oldState, spaceship ) => this.#onSpaceshipEnter( oldState, spaceship ), ( newState ) => this.#onSpaceshipLeave( newState ) );
    }

    #createCamera() {

        this.camera = new BABYLON.ArcRotateCamera( "camera_camera", this.#focusAlpha, this.#focusBeta, this.config.offset, BABYLON.Vector3.Zero(), this.scene );
        this.camera.maxZ = this.config.max;
        this.camera.parent = this.root;
    }

    #addOrigin() {

        this.origin = new CameraOrigin( this );
    }

    #syncWithTarget( target ) {

        this.origin.actualPosition.copyFrom( BABYLON.Vector3.Lerp( this.origin.actualPosition, target.position, this.config.lerp ) );
        this.root.rotationQuaternion.copyFrom( BABYLON.Quaternion.Slerp( this.root.rotationQuaternion, target.rotationQuaternion, this.config.lerp ) );
    }
    
    #onPlayerEnter( oldState, player ) {

        log( "camera attached to player" );

        this.target = player;
    }

    #onPlayerLeave( newState ) {
        
        log( "camera detached from player" );
        
        this.target = null;
    }
    
    #onSpaceshipEnter( oldState, spaceship ) {
        
        log( "camera attached to spaceship" );
        
        this.target = spaceship;
    }
    
    #onSpaceshipLeave( newState ) {
        
        log( "camera detached from spaceship" );
        
        this.target = null;
    }

}