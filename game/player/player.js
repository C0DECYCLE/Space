"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Player {

    config = {

        float: 4.005,

        walk: 0.005,
        run: 0.015,
        jump: 0.01,

        standingup: 0.05,
        deceleration: 0.15
    };

    game = null;
    scene = null;
    camera = null;
    controls = null;

    mesh = null;
    physics = null;
    interaction = null;

    state = new StateMachine();

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;
        this.camera = this.game.camera;
        this.controls = this.game.controls;

        EngineUtils.configure.call( this, config );

        this.#createMesh();    
        this.#setupStates();
        this.#setupPhysics();
        this.#setupInteraction();
    }

    get root() {

        return this.mesh;
    }

    get position() {
        
        return this.root.position;
    }

    get rotationQuaternion() {
        
        return this.root.rotationQuaternion;
    }

    get planet() {

        return this.physics.planet;
    }

    get spaceship() {

        return this.physics.spaceship;
    }

    update() {

        this.physics.update();
        this.interaction.update();
    }

    planetInsert( planet, distance, planetThreashold ) {

        if ( distance <= planetThreashold && this.state.is( "space" ) === true ) {

            this.state.set( "planet", planet );
        }

        if ( this.state.is( "planet" ) === true && PlanetUtils.compare( this.planet, planet ) && distance > planetThreashold ) {

            this.state.set( "space" );
        }
    }

    #setupStates() {

        this.state.add( "space", ( oldState ) => this.#onSpaceEnter( oldState ), ( newState ) => this.#onSpaceLeave( newState ) );
        this.state.add( "planet",( oldState, planet ) => this.#onPlanetEnter( oldState, planet ), ( newState ) => this.#onPlanetLeave( newState ) );
        this.state.add( "spaceship",( oldState, spaceship ) => this.#onSpaceshipEnter( oldState, spaceship ), ( newState ) => this.#onSpaceshipLeave( newState ) );

        this.state.set( "space" );
    }

    #createMesh() {

        const body = BABYLON.MeshBuilder.CreateCapsule( "player_mesh_body", { height: 2, radius: 0.5, tessellation: 8, subdivisions: 1, capSubdivisions: 3 }, this.scene );

        const head = BABYLON.MeshBuilder.CreateBox( "player_mesh_head", { width: 0.7, height: 0.35, depth: 0.3 }, this.scene );
        head.position.copyFromFloats( 0, 0.5, 0.4 );

        this.mesh = BABYLON.Mesh.MergeMeshes( [ body, head ], true );
        this.mesh.removeVerticesData( BABYLON.VertexBuffer.NormalKind );
        this.mesh.removeVerticesData( BABYLON.VertexBuffer.UVKind );
        this.mesh.id = "player";
        this.mesh.name = this.mesh.id;
        this.mesh.material = new BABYLON.StandardMaterial( "player_material", this.scene );
        this.mesh.material.setColorIntensity( "#ff226b", 0.5 );
        this.mesh.rotationQuaternion = this.mesh.rotation.toQuaternion();
        
        this.game.star.shadow.cast( this.mesh );
        this.game.star.shadow.receive( this.mesh );

        /*
        var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1), Math.PI / 3, 20, this.scene);
        light.intensity = 4;
        light.parent = this.root;
        */
    }

    #setupPhysics() {

        this.physics = new PlayerPhysics( this );
    }
    
    #setupInteraction() {

        this.interaction = new PlayerInteraction( this );
    }

    #onSpaceEnter( oldState ) {

        log( "player entered space" );

        this.camera.attachToPlayer( this );
    }

    #onSpaceLeave( newState ) {
        
        log( "player left space" );
    }
    
    #onPlanetEnter( oldState, planet ) {
        
        log( "player entered planet" );

        this.physics.planet = planet;
    }
    
    #onPlanetLeave( newState ) {
        
        log( "player left planet" );

        this.physics.planet = null;
    }

    #onSpaceshipEnter( oldState, spaceship ) {
        
        log( "player entered spaceship" );

        this.physics.pause();
        this.physics.spaceship = spaceship;
        this.physics.spaceship.enter( this );
        this.camera.attachToSpaceship( this.physics.spaceship );
    }
    
    #onSpaceshipLeave( newState ) {
        
        log( "player left spaceship" );

        this.physics.spaceship.leave( this );
        this.physics.spaceship = null;
        this.physics.resume();
    }

}