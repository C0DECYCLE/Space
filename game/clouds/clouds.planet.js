"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudsPlanet {

    config = {

        resolution: 32
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

        const rowRes = this.config.resolution;

        for ( let row = 0; row < rowRes; row++ ) {

            const colRes = Math.round( rowRes * 0.5 - Math.abs( row - rowRes * 0.5 ) );

            for ( let col = 0; col < colRes; col++ ) {

                this.#makeCloud( row / rowRes, col / colRes );
            }
        }
    }

    #makeCloud( rowStep, colStep ) {

        const height = this.#planet.config.radius + this.#planet.config.maxHeight * (0.25 + 1/*Math.random()*/ * 0.5);
        const rot = new BABYLON.Vector3( 0, colStep * 2, rowStep - 0.5 ).scaleInPlace( Math.PI );

        const cloud = new Cloud( this.#clouds.game, {} );
        cloud.position.copyFromFloats( height, 0, 0 ).applyRotationQuaternionInPlace( rot.toQuaternion() );
        cloud.rotationQuaternion.copyFrom( rot.addInPlaceFromFloats( 0, 0, -Math.PI / 2 ).toQuaternion() );
        cloud.parent = this.#planet.root;
        cloud.lod.set( 0 );
        cloud.randomValue = Math.random() * this.#planet.config.radius;

        this.list.push( cloud );
    }

}