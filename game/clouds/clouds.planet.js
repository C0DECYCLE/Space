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

            const height = this.#planet.config.radius + this.#planet.config.maxHeight * (0.25 + Math.random() * 0.5)
            const rot = new BABYLON.Vector3( 0, Math.random() * 2, Math.random() - 0.5 ).scaleInPlace( Math.PI );

            const cloud = new Cloud( this.#clouds.game, {} );
            cloud.position.copyFromFloats( height, 0, 0 ).applyRotationQuaternionInPlace( rot.toQuaternion() );
            cloud.rotationQuaternion.copyFrom( rot.addInPlaceFromFloats( 0, 0, -Math.PI / 2 ).toQuaternion() );
            cloud.parent = this.#planet.root;
            cloud.lod.set( 0 );
            cloud.randomValue = Math.random() * this.#planet.config.radius;

            this.list.push( cloud );
        }
    }

}