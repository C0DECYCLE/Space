"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Camera {

    config = {

        max: 10 * 1000 * 1000,

        offset: 8,
        lerp: 0.1
    };

    manager = null;
    scene = null;
    controls = null;
    
    root = null;
    camera = null;

    state = new StateMachine();
    origin = null;

    targets = {};
    target = {

        object: null,
        camera: null
    };

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;
        this.controls = this.manager.controls;

        EngineUtils.configure( this.config, config );

        this.#createRoot();
        this.#setupStates();
        this.#createCamera();
        this.#addOrigin();
        this.#addTargets();
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

    free( event ) {

        const deltaCorrection = Space.engine.deltaCorrection;

        this.camera.alpha -= event.event.movementX * this.controls.config.panning * deltaCorrection;
        this.camera.beta -= event.event.movementY * this.controls.config.panning * deltaCorrection;
    }

    update() {

        if ( this.target.object !== null && this.target.camera !== null ) {

            this.target.camera.update( this.target.object );
        }
    }

    screenCoverage( node ) {

        const distance = EngineUtils.getWorldPosition( node ).subtractInPlace( this.position ).length();
        const size = EngineUtils.getBounding( node ).size;
        
        return size / distance;
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

        this.camera = new BABYLON.ArcRotateCamera( "camera_camera", -Math.PI / 2, Math.PI / 2, this.config.offset, BABYLON.Vector3.Zero(), this.scene );
        this.camera.maxZ = this.config.max;
        this.camera.parent = this.root;
    }

    #addOrigin() {

        this.origin = new CameraOrigin( this );
    }

    #addTargets() {

        this.targets.player = new CameraTargetPlayer( this );
        this.targets.spaceship = new CameraTargetSpaceship( this );
    }
    
    #enterTarget( object, camera ) {

        this.target.object = object;
        this.target.camera = camera;

        this.target.camera.focus();
    }

    #leaveTarget() {

        this.target.object = null;
        this.target.camera = null;
    }
    
    #onPlayerEnter( oldState, player ) {

        log( "camera attached to player" );

        this.#enterTarget( player, this.targets.player );
    }

    #onPlayerLeave( newState ) {
        
        log( "camera detached from player" );
        
        this.#leaveTarget();
    }
    
    #onSpaceshipEnter( oldState, spaceship ) {
        
        log( "camera attached to spaceship" );
        
        this.#enterTarget( spaceship, this.targets.spaceship );
    }
    
    #onSpaceshipLeave( newState ) {
        
        log( "camera detached from spaceship" );
        
        this.#leaveTarget();
    }

}