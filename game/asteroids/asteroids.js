"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroids {

    config = {

    };

    game = null;
    scene = null;

    models = [];
    
    list = [];

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure.call( this, config );

        this.#setupModels();
    }

    register( type, config ) {

        let asteroids = null;

        switch ( type ) {

            case "cluster": asteroids = new AsteroidsCluster( this.game, config ); break;

            case "ring": asteroids = new AsteroidsRing( this.game, config ); break;
        }

        this.list.push( asteroids );
    }

    update() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    #setupModels() {
        
        const importLods = this.scene.assets.list.get( "asteroid" ).getChildren();
        
        for ( let i = 0; i < importLods.length; i++ ) {
            
            this.models.push( this.scene.assets.traverse( importLods[i], mesh => {
            
                this.game.star.shadow.receive( mesh, undefined, undefined, false );
            } ) );
        }
    }

}