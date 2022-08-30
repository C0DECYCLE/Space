"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Spaceship {

    config = {

        key: UUIDv4()
    };

    game = null;
    scene = null;
    spaceships = null;

    lod = null;
    physics = null;

    seatOffset = new BABYLON.Vector3( 0, 1.5, -1.2 );

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;
        this.spaceships = this.game.spaceships;

        EngineUtils.configure( this.config, config );
        
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

    update() {

        this.lod.update();
        this.physics.update();
    }

    #createLod() {
        
        this.lod = new LOD( this.game );
        this.lod.fromModels( this.spaceships.model, mesh => {

            this.game.star.shadow.cast( mesh, true, false );
            this.game.postprocess.register( mesh );
        } );

        this.root.name = `spaceships_spaceship${ this.config.key }`;
    }

    #addPhysics() {

        this.physics = new PhysicsEntity( this.root, PhysicsEntity.TYPES.DYNAMIC );
    }

    #registerInteractable() {

        const cockpit = this.root.getChildMeshes( false, mesh => mesh.name == "i-glass" )[0];

        this.game.player.interaction.register( cockpit, () => {

            this.game.player.state.set( "spaceship", this );
        } );
    }

}