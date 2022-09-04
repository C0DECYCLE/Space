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

    variants = new Map();
    list = [];

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure.call( this, config );

        this.#setupVariants();
    }

    register( variant, config ) {

        const variantClass = this.variants.get( variant );

        this.list.push( new variantClass( this.game, config ) );
    }

    update() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }
    
    planetInsert( planet, distance, planetThreashold ) {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].planetInsert( planet, distance, planetThreashold );
        }
    }

    #setupVariants() {
        
        this.#setupVariant( SpaceshipVulcan );
    }

    #setupVariant( variantClass ) {

        variantClass.load( this.game );
        this.variants.set( variantClass.name.toLowerCase(), variantClass );
    }

}