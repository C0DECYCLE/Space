"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Player {

    config = {

        speed: 0.05, // 0.15 run 0.05 walk
        standingup: 0.05,

        experimentalPointerLock: true
    };

    manager = null;
    scene = null;
    camera = null;
    controls = null;

    root = null;
    mesh = null;
    physics = null;

    state = new StateMachine();

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;
        this.camera = this.manager.camera;
        this.controls = this.manager.controls;

        this.config.speed = config.speed || this.config.speed;

        this.#createRoot();
        this.#setupInspector();
        this.#setupStates();
        this.#createMesh();    
        this.#setupPhysics();
        this.#registerObservables();
    }

    get position() {
        
        return this.root.position;
    }

    get rotationQuaternion() {
        
        return this.root.rotationQuaternion;
    }

    update() {

        this.#updateFromInspector();

        if ( this.state.is( "space" ) == true ) {

            this.physics.space();

        } else if ( this.state.is( "planet" ) == true ) {

            this.physics.planet();
        }
    }

    #createRoot() {

        this.root = new BABYLON.Mesh( "player", this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    #setupInspector() {

        this.root._speed = this.config.speed;

        this.root.inspectableCustomProperties = [

            {
                label: "Speed",
                propertyName: "_speed",
                type: BABYLON.InspectableType.Slider,
                min: 0.05,
                max: 10,
                step: 1,
            }
        ];
    }

    #setupStates() {

        this.state.add( "space", ( oldState ) => this.#onSpaceEnter( oldState ), ( newState ) => this.#onSpaceLeave( newState ) );
        this.state.add( "planet",( oldState, planet ) => this.#onPlanetEnter( oldState, planet ), ( newState ) => this.#onPlanetLeave( newState ) );

        this.state.set( "space" );
    }

    #createMesh() {

        let material = new BABYLON.StandardMaterial( "player_material", this.scene );
        material.setColorIntensity( "#ff226b", 0.5 );

        this.mesh = BABYLON.MeshBuilder.CreateCapsule( "player_mesh", { height: 2, radius: 0.5, tessellation: 8, subdivisions: 1, capSubdivisions: 3 }, this.scene );
        this.mesh.convertToFlatShadedMesh();
        this.mesh.material = material;
        this.mesh.parent = this.root;
        
        let head = BABYLON.MeshBuilder.CreateBox( "player_mesh_head", { width: 0.7, height: 0.35, depth: 0.3 }, this.scene );
        head.position.copyFromFloats( 0, 0.5, 0.4 );
        head.material = material;
        head.parent = this.mesh;
    }

    #setupPhysics() {

        this.physics = new PlayerPhysics( this );
    }

    #registerObservables() {

        this.controls.onPointerMove.add( event => this.#onPointerMove( event ) );
    }

    #updateFromInspector() {

        this.config.speed = this.root._speed;
    }

    #onPointerMove( event ) {
    
        if ( this.controls.isPointerDown == true || this.config.experimentalPointerLock == true ) {

            if ( this.controls.isKeyboarding == true ) {

                this.#panPlayer( event );

            } else {

                this.camera.free( event );
            }
        }
    }

    #panPlayer( event ) {

        this.root.physicsImpostor.setAngularVelocity( BABYLON.Vector3.Zero() );

        this.root.rotate( BABYLON.Axis.Y, event.event.movementX * this.controls.config.panning, BABYLON.Space.LOCAL );
        this.root.rotate( BABYLON.Axis.X, event.event.movementY * this.controls.config.panning, BABYLON.Space.LOCAL );
    }

    #onSpaceEnter( oldState ) {

        log( "player entered space" );
    }

    #onSpaceLeave( newState ) {
        
        log( "player left space" );
    }
    
    #onPlanetEnter( oldState, planet ) {
        
        log( "player entered planet" );

        this.physics.setPlanet( planet );
    }
    
    #onPlanetLeave( newState ) {
        
        log( "player left planet" );

        this.physics.setPlanet( null );
    }

}