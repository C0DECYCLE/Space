"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudsPlanet {

    config = {

        seed: undefined,
        density: 0.1,
    };

    list = [];

    #clouds = null;
    #planet = null;

    #perlin = null;

    constructor( clouds, planet, config ) {

        this.#clouds = clouds;
        this.#planet = planet;

        EngineUtils.configure.call( this, config );

        this.#setupPerlin();
        this.#spawnClouds();
    }

    update() {


    }

    #setupPerlin() {

        this.config.seed = this.config.seed || this.#planet.config.seed.y;

        this.#perlin = new perlinNoise3d();
        this.#perlin.noiseSeed( this.config.seed );
    }

    #spawnClouds() { this.testcache = new BABYLON.Node( "test_cache", this.scene );
    this.testcache.setEnabled( false );

        const planetSurfaceArea = 4 * Math.PI * this.#planet.config.radius;
        const nSamples = Math.floor( planetSurfaceArea * this.config.density );
        log(nSamples)
        for ( let i = 0; i < nSamples; i++ ) {

            const theta = 2 * Math.PI * i / Math.PHI;
            const phi = Math.acos( 1 - 2 * ( i + 0.5 ) / nSamples );

            this.#evalCloud( theta, phi, nSamples );
        }
    }

    #evalCloud( theta, phi, nSamples ) {

        const position = new BABYLON.Vector3( Math.cos( theta ) * Math.sin( phi ), Math.sin( theta ) * Math.sin( phi ), Math.cos( phi ) ); 
        
        const noiseOffset = new BABYLON.Vector3( this.#planet.position.x, this.config.seed, this.#planet.position.z );
        const cull = this.#noise( position.clone().scaleInPlace( this.#planet.config.radius * 0.005 ).addInPlace( noiseOffset ) );
        const height = this.#noise( position.clone().scaleInPlace( this.#planet.config.radius * -0.0025 ).addInPlace( noiseOffset ) );

        position.scaleInPlace( this.#planet.config.radius + this.#planet.config.maxHeight * (0.25 + height * 0.5) );

        if ( cull < 0.35 ) {
            
            this.#makeCloud( position, nSamples );
        }
    }

    #makeCloud( position, nSamples ) {

        const cloud = new Cloud( this.#clouds.game, {} );

        cloud.position.copyFrom( position );
        cloud.root.setDirection( position.negate(), undefined, -Math.PI / 2, undefined );
        cloud.root.rotate( BABYLON.Axis.Y, Math.random() * Math.PI * 2, BABYLON.Space.LOCAL );
        cloud.scaling.copyFromFloats( Math.random(), Math.random(), Math.random() ).scaleInPlace( 0.75 ).addInPlaceFromFloats( 0.5, 0.5, 0.5 ).scaleInPlace( 75 );

        cloud.parent = this.testcache;//this.#planet.root;
        cloud.lod.set( -1 ); //dynamic lod
        cloud.randomValue = Math.random() * nSamples;

        this.list.push( cloud );
    }

    #noise( vector ) {

        if ( typeof vector === "number" ) {

            return this.#perlin.get( vector, vector, vector );
        }

        return this.#perlin.get( vector.x, vector.y, vector.z );
    }

}