"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Spaceship {

    static load( game ) {
        
        this.model = [];
        
        const importLods = game.scene.assets.list.get( "spaceship"/*`spaceship_${ this.name }`*/ ).getChildren();
        
        for ( let i = 0; i < importLods.length; i++ ) {
            
            this.model.push( game.scene.assets.traverse( importLods[i], mesh => {
            
                game.star.shadow.receive( mesh, true, false );
            } ) );
        }
    }

    config = {

        key: UUIDv4()
    };

    game = null;
    scene = null;
    spaceships = null;

    lod = null;
    physics = null;

    seatOffset = new BABYLON.Vector3( 0, 0, 0 );
    seatDiffrence = new BABYLON.Vector3();

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

    enter( player ) {

        this.seatDiffrence.copyFrom( this.position ).subtractInPlace( player.position ).applyRotationQuaternionInPlace( this.rotationQuaternion.invert() );
    } 

    leave( player ) {

        player.position.copyFrom( this.position ).subtractInPlace( this.seatDiffrence.applyRotationQuaternionInPlace( this.rotationQuaternion ) );
    }

    #createLod() {

        this.lod = new LOD( this.game );
        this.lod.fromModels( this.constructor.model, mesh => {

            this.game.star.shadow.cast( mesh, true, false );
        } );

        this.root.name = `spaceships_spaceship${ this.config.key }`;
    }

    #addPhysics() {

        this.physics = new SpaceshipPhysics( this );
    }

    #registerInteractable() {

        const cockpit = this.root.getChildMeshes( false, mesh => mesh.name == "i-glass" )[0];

        this.game.player.interaction.register( cockpit, () => {

            this.game.player.state.set( "spaceship", this );
        } );
    }

}