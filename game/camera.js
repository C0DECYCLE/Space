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

    position = new BABYLON.Vector3();

    #focusAlpha = -Math.PI / 2;
    #focusBeta = Math.PI / 2;

    constructor( scene, controls, config ) {

        this.scene = scene;
        this.controls = controls;

        this.root = new BABYLON.TransformNode( "camera", this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
        this.root._actualPosition = this.position;
        this.root.inspectableCustomProperties = [
            {
                label: "Actual Position",
                propertyName: "_actualPosition",
                type: BABYLON.InspectableType.Vector3,
            }
        ];

        this.state.add( "player", ( oldState, player ) => this.#onPlayerEnter( oldState, player ), ( newState ) => this.#onPlayerLeave( newState ) );
        this.state.add( "spaceship", ( oldState, spaceship ) => this.#onSpaceshipEnter( oldState, spaceship ), ( newState ) => this.#onSpaceshipLeave( newState ) );

        this.#createCamera();

        //this.position = this.root.position;
        this.scene.onBeforeRenderObservable.add( () => this.#preRenderOrigin() );
        this.scene.onAfterRenderObservable.add( () => this.#postRenderOrigin() );
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
            
            this.position.copyFrom( BABYLON.Vector3.Lerp( this.position, this.target.root.position, this.config.lerp ) );
            this.root.rotationQuaternion.copyFrom( BABYLON.Quaternion.Slerp( this.root.rotationQuaternion, this.target.root.rotationQuaternion, this.config.lerp ) );

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

    #preRenderOrigin() {

        if ( this.scene.rootNodes[0].name != "camera" ) {

            console.error( "Camera node not at position 0 in scene.rootNodes!" );

            return;
        }

        let rootNodes = this.scene.rootNodes;
        let length = rootNodes.length;
        let cameraPosition = this.position;
        let node = null;
        let i;

        for ( i = 1; i < length; i++ ) {

            node = rootNodes[i];
            
            if ( !node.position ) {

                continue;
            }

            if ( !node._storedPosition ) {

                node._storedPosition = new BABYLON.Vector3();
                node._renderPosition = new BABYLON.Vector3();

                node.inspectableCustomProperties = [
                    {
                        label: "Actual Position",
                        propertyName: "_storedPosition",
                        type: BABYLON.InspectableType.Vector3,
                    },
                    {
                        label: "Render Position",
                        propertyName: "_renderPosition",
                        type: BABYLON.InspectableType.Vector3,
                    }
                ];
            }

            node._storedPosition.copyFrom( node.position );

            node.position.subtractInPlace( cameraPosition );
            
            node._renderPosition.copyFrom( node.position );
        }
    }

    #postRenderOrigin() {

        let rootNodes = this.scene.rootNodes;
        let length = rootNodes.length;
        let node = null;
        let i;

        for ( i = 1; i < length; i++ ) {

            node = rootNodes[i];

            if ( node._storedPosition ) {

                node.position.copyFrom( node._storedPosition );
            }
        }
    }

}