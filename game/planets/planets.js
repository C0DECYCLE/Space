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
    }

    #insert( position ) {

        this.list.forEach( ( planet, key ) => {
            
            let distance = BABYLON.Vector3.Distance( planet.root.position, position );
            let distanceRadiusFactor = distance / planet.config.radius;
            
            if ( distanceRadiusFactor < 1.3/*2*/ && this.player.state.is( "space" ) ) {

                this.player.state.set( "planet", planet );
            }

            if ( distanceRadiusFactor < 20 ) {
                
                planet.insert( position, distance );
            }
        
            planet.update();
        } );
    }

}