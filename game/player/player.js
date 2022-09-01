"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Player {

    config = {

        float: 0.005,

        walk: 0.005,
        run: 0.015,
        jump: 0.01,

        standingup: 0.05
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
        this.#setupInspector();
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

        this.#updateFromInspector();

        this.physics.update();
        this.interaction.update();
    }

    #setupInspector() {

        this.root._float = this.config.float;

        this.root.inspectableCustomProperties = [

            {
                label: "Float",
                propertyName: "_float",
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
        this.state.add( "spaceship",( oldState, spaceship ) => this.#onSpaceshipEnter( oldState, spaceship ), ( newState ) => this.#onSpaceshipLeave( newState ) );

        this.state.set( "space" );
    }

    #createMesh() {

        const material = new BABYLON.StandardMaterial( "player_material", this.scene );
        material.setColorIntensity( "#ff226b", 0.5 );

        this.mesh = BABYLON.MeshBuilder.CreateCapsule( "player", { height: 2, radius: 0.5, tessellation: 8, subdivisions: 1, capSubdivisions: 3 }, this.scene );
        this.mesh.convertToFlatShadedMesh();
        this.mesh.material = material;
        this.mesh.rotationQuaternion = this.mesh.rotation.toQuaternion();
        
        const head = BABYLON.MeshBuilder.CreateBox( "player_mesh_head", { width: 0.7, height: 0.35, depth: 0.3 }, this.scene );
        head.position.copyFromFloats( 0, 0.5, 0.4 );
        head.material = material;
        head.parent = this.mesh;
    
        this.game.star.shadow.cast( this.mesh, true, true );
        this.game.star.shadow.receive( this.mesh, true, true );
    }

    #setupPhysics() {

        this.physics = new PlayerPhysics( this );
    }
    
    #setupInteraction() {

        this.interaction = new PlayerInteraction( this );
    }

    #updateFromInspector() {

        this.config.float = this.root._float;
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
        this.physics.planet.generator.toggleMask( true );
    }
    
    #onPlanetLeave( newState ) {
        
        log( "player left planet" );

        this.physics.planet.generator.toggleMask( false );
        this.physics.planet = null;
    }

    #onSpaceshipEnter( oldState, spaceship ) {
        
        log( "player entered spaceship" );

        this.interaction.unhighlightAll();
        this.physics.spaceship = spaceship;
        this.physics.spaceship.enter( this );
        this.camera.attachToSpaceship( this.physics.spaceship );
    }
    
    #onSpaceshipLeave( newState ) {
        
        log( "player left spaceship" );

        this.physics.spaceship.leave( this );
        this.physics.spaceship = null;
    }

}