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

    list = new Map();

    constructor( manager ) {
        
        this.manager = manager;
        this.scene = this.manager.scene;
        this.camera = this.manager.camera;
        this.player = this.manager.player;
    }

    register( config ) {

        this.list.set( config.key, new Planet( this.manager, config ) );
    }

    update() {

        this.#insert( this.camera.position );
        this.#update();
    }

    #insert( position ) {

        this.list.forEach( ( planet, key ) => {
            
            const distance = BABYLON.Vector3.Distance( planet.position, position );
            const distanceRadiusFactor = distance / planet.config.radius;
            const planetThreashold = 1 + planet.config.influence;
            
            if ( distanceRadiusFactor <= planetThreashold && this.player.state.is( "space" ) ) {

                this.player.state.set( "planet", planet );
                //log(planet.config.key);
            }

            /*
            if ( distanceRadiusFactor > planetThreashold && this.player.state.is( "planet" ) ) {

                this.player.state.set( "space" );
            }
            */
           
            planet.insert( position, distance );
        } );
    }

    #update() {

        this.list.forEach( ( planet, key ) => planet.update() );
    }

}