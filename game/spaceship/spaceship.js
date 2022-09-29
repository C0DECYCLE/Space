"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Spaceship {

    static load( game ) {
        
        this.model = [];
        
        const importLods = game.scene.assets.list.get( `spaceship_${ this.name.toLowerCase() }` ).getChildren();
        
        for ( let i = 0; i < importLods.length; i++ ) {
            
            let model = game.scene.assets.traverse( importLods[i], mesh => {
            
                game.star.shadow.receive( mesh, undefined, undefined, false );
            }, true );
            
            //model = game.scene.assets.merge( model );
            //game.star.shadow.receive( model, undefined, undefined, false );
            
            this.model.push( model );
        }
    }

    config = {

        key: UUIDv4(),

        landingAngle: 45 * EngineUtils.toRadian,
        upLerp: 0.1,
    };

    game = null;
    scene = null;
    spaceships = null;

    lod = null;
    physics = null;

    #seatDiffrence = new BABYLON.Vector3();
    #hasController = false;
    #nearPlanet = null;
    #isLanded = false;

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;
        this.spaceships = this.game.spaceships;
        
        EngineUtils.configure.call( this, config );
        
        this.#createLod();   
        this.#addPhysics();
        this.#registerInteractable();
    }

    get root() {

        return this.lod.root;
    }

    get position() {
        
        return this.lod.position;
    }

    get rotationQuaternion() {
        
        return this.lod.rotationQuaternion;
    }

    get hasController() {

        return this.#hasController;
    }

    get nearPlanet() {

        return this.#nearPlanet;
    }

    get isLanded() {

        return this.#isLanded;
    }

    update() {

        this.lod.update();
        this.physics.update();
    }

    planetInsert( planet, distance, planetThreashold ) {

        if ( distance <= planetThreashold && this.#nearPlanet === null ) {

            this.#nearPlanet = planet;
        }

        if ( this.#nearPlanet !== null && PlanetUtils.compare( this.#nearPlanet, planet ) && distance > planetThreashold ) {

            this.#nearPlanet = null;
        }
    }

    enter( player ) {

        this.#rememberSeat( player );
        this.#hasController = true;
    }

    leave( player ) {

        this.#hasController = false;
        this.#putOutOfSeat( player );
    }

    land() {

        this.#isLanded = true;
    }

    takeoff() {

        this.#isLanded = false;
    }

    #createLod() {

        this.lod = new LOD( this.game );
        this.lod.fromModels( this.constructor.model, mesh => {

            this.game.star.shadow.cast( mesh );
        } );

        this.root.name = `spaceships_spaceship${ this.config.key }`;

        this.game.ui.registerMarker( this.root, { type: "hint" } );
    }

    #addPhysics() {

        this.physics = new SpaceshipPhysics( this );
    }

    #registerInteractable() {
        
        const cockpit = this.root.getChildMeshes( false, mesh => mesh.name == "i-glass" )[0];

        this.game.player.interaction.register( cockpit, () => {

            this.game.player.state.set( "spaceship", this );

        }, () => {

            this.game.player.state.set( "space" );
        } );
    }

    #rememberSeat( player ) {

        this.#seatDiffrence.copyFrom( this.position ).subtractInPlace( player.position ).applyRotationQuaternionInPlace( this.rotationQuaternion.invert() );
    }

    #putOutOfSeat( player ) {

        player.position.copyFrom( this.position ).subtractInPlace( this.#seatDiffrence.applyRotationQuaternionInPlace( this.rotationQuaternion ) );
    }

}