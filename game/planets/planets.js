"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Planets {

    config = {

    };

    game = null;
    scene = null;
    camera = null;
    player = null;
    spaceships = null;

    list = [];

    #maskMaterial = null;

    constructor( game, config ) {
        
        this.game = game;
        this.scene = this.game.scene;
        this.camera = this.game.camera;
        this.player = this.game.player;
        this.spaceships = this.game.spaceships;

        EngineUtils.configure.call( this, config );
        
        this.#createMaskMaterial();
    }

    register( config ) {

        this.list.push( new Planet( this.game, config ) );
    }

    registerFromConfigs( configs ) {

        for ( let i = 0; i < configs.length; i++ ) {

            this.register( configs[i] );
        }
    }

    getMaskMaterial() {

        return this.#maskMaterial;
    }

    update() { if ( window.freeze === true ) return;

        this.#insert();
        this.#update();
    }

    #insert() {

        for ( let i = 0; i < this.list.length; i++ ) {

            const planet = this.list[i];
            const distance = this.camera.getScreenDistance( planet.root );
            const planetThreashold = planet.config.radius + planet.config.influence;
            
            //this.player.planetInsert( planet, distance, planetThreashold );
            this.spaceships.planetInsert( planet, distance, planetThreashold );
           
            planet.helper.toggleShadow( distance < planet.config.radius * 5 );
            planet.insert( distance );
        }
    }

    #update() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    #createMaskMaterial() {

        this.#maskMaterial = new BABYLON.StandardMaterial( "planet_mask_material", this.scene );
        this.#maskMaterial.disableLighting = true;
        
        this.#maskMaterial.diffuseColor = new BABYLON.Color3( 0, 0, 0 );
        this.#maskMaterial.specularColor = new BABYLON.Color3( 0, 0, 0 );
        this.#maskMaterial.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        this.#maskMaterial.ambientColor = new BABYLON.Color3( 0, 0, 0 );

        this.#maskMaterial.freeze();
    }
}