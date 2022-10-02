"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudsPlanet {

    config = {

    };

    list = [];

    #clouds = null;
    #planet = null;

    constructor( clouds, planet, config ) {

        this.#clouds = clouds;
        this.#planet = planet;

        EngineUtils.configure.call( this, config );

        this.#spawnClouds();
    }

    update() {


    }

    #spawnClouds() {

        for ( let i = 0; i < 100; i++ ) {

            const height = this.#planet.config.radius + this.#planet.config.maxHeight * (0.5 + Math.random() * 0.5)

            const cloud = new Cloud( this.#clouds.game, {} );
            cloud.parent = this.#planet.root;
            cloud.position.copyFromFloats( height, 0, 0 ).applyRotationQuaternionInPlace( new BABYLON.Vector3( 0, Math.random() * 2, Math.random() - 0.5 ).scaleInPlace( Math.PI ).toQuaternion() );
            EngineUtils.setNodeDirection( cloud, cloud.root.forward, cloud.position.normalizeToNew() );

            //cloud.lod.set( Math.floor( Math.random() * 3 ) );
            cloud.lod.set( 0 );
            //cloud.randomValue = Math.random() * 10;

            this.list.push( cloud );
        }
    }

}