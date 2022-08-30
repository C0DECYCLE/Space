"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Spaceships {

    config = {

    };

    game = null;
    scene = null;

    model = [];
    
    list = [];

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure( this.config, config );

        this.#setupModel();
    }

    register( config ) {

        this.list.push( new Spaceship( this.game, config ) );
    }

    update() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    #setupModel() {
        
        const importLods = this.scene.assets.list.get( "spaceship" ).getChildren();
        
        for ( let i = 0; i < importLods.length; i++ ) {
            
            this.model.push( this.scene.assets.traverse( importLods[i], mesh => {
            
                this.game.star.shadow.receive( mesh, true, false );
            } ) );
        }
    }

}