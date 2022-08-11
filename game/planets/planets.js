"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Planets {

    camera = null;
    player = null;

    list = new Map();

    constructor( camera, player ) {
    
        this.camera = camera;
        this.player = player;
    }

    register( planet ) {

        this.list.set( planet.config.key, planet );
    }

    update() {

        this.#insert( this.camera.position );
    }

    #insert( position ) {

        this.list.forEach( ( planet, key ) => {
            
            let distance = BABYLON.Vector3.Distance( planet.root.position, position );
            let distanceRadiusFactor = distance / planet.config.radius;
            
            if ( distanceRadiusFactor < 2 && this.player.state.is( "space" ) ) {

                //this.player.state.set( "planet", planet );
            }

            if ( distanceRadiusFactor < 20 ) {
                
                planet.insert( position, distance );
            }
        
        } );
    }

}