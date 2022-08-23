"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Planets {

    manager = null;
    scene = null;
    camera = null;
    player = null;

    list = new Map(); //swop out with [] array

    #maskMaterial = null;

    constructor( manager ) {
        
        this.manager = manager;
        this.scene = this.manager.scene;
        this.camera = this.manager.camera;
        this.player = this.manager.player;

        this.#createMaskMaterial();
    }

    register( config ) {

        this.list.set( config.key, new Planet( this.manager, config ) );
    }

    registerFromConfigs( configs ) {

        for ( let i = 0; i < configs.length; i++ ) {

            this.register( configs[i] );
        }
    }

    getMaskMaterial() {

        return this.#maskMaterial;
    }

    update() {

        this.#insert( this.camera.position );
        this.#update();
    }

    #insert( position ) {

        this.list.forEach( ( planet, key ) => {
            
            const distance = BABYLON.Vector3.Distance( planet.position, position );
            const planetThreashold = planet.config.radius + planet.config.influence;
            
            if ( distance <= planetThreashold && this.player.state.is( "space" ) === true ) {

                this.player.state.set( "planet", planet );
            }

            if ( this.player.state.is( "planet" ) === true && PlanetUtils.compare( this.player.planet, planet ) && distance > planetThreashold ) {

                this.player.state.set( "space" );
            }
           
            planet.insert( position, distance );
        } );
    }

    #update() {

        this.list.forEach( ( planet, key ) => planet.update() );
    }

    #createMaskMaterial() {

        this.#maskMaterial = new BABYLON.StandardMaterial( "planet_mask_material", this.scene );
        this.#maskMaterial.disableLighting = true;
        
        this.#maskMaterial.diffuseColor = new BABYLON.Color3( 0, 0, 0 );
        this.#maskMaterial.specularColor = new BABYLON.Color3( 0, 0, 0 );
        this.#maskMaterial.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        this.#maskMaterial.ambientColor = new BABYLON.Color3( 0, 0, 0 );
    }
}