"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudsPlanet {

    static LOD_LIMIT = 2 ** 2.5;

    config = {

        seed: undefined,
        density: 0.015,
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

    update( distance ) {

        const radiusDistance = distance / this.#planet.config.radius;

        if ( radiusDistance < CloudsPlanet.LOD_LIMIT ) {

            this.#updateLODs( distance, radiusDistance );
        }
    }

    #setupPerlin() {

        this.config.seed = this.config.seed || this.#planet.config.seed.y;

        this.#perlin = new perlinNoise3d();
        this.#perlin.noiseSeed( this.config.seed );
    }

    #spawnClouds() {

        const planetSurfaceArea = 4 * Math.PI * this.#planet.config.radius;
        const nSamples = Math.floor( planetSurfaceArea * this.config.density );
        
        for ( let i = 0; i < nSamples; i++ ) {

            const theta = 2 * Math.PI * i / Math.PHI;
            const phi = Math.acos( 1 - 2 * ( i + 0.5 ) / nSamples );

            this.#evalCloud( theta, phi, nSamples );
        }
    }

    #evalCloud( theta, phi, nSamples ) {

        const position = new BABYLON.Vector3( Math.cos( theta ) * Math.sin( phi ), Math.sin( theta ) * Math.sin( phi ), Math.cos( phi ) ); 
        
        const noiseOffset = new BABYLON.Vector3( this.#planet.position.x, this.config.seed, this.#planet.position.z );
        const cull = this.#noise( position.clone().scaleInPlace( this.#planet.config.radius * 0.001 ).addInPlace( noiseOffset ) );
        const height = this.#noise( position.clone().scaleInPlace( this.#planet.config.radius * -0.0025 ).addInPlace( noiseOffset ) );
        const limit = 0.35;

        position.scaleInPlace( this.#planet.config.radius + this.#planet.config.maxHeight * (0.5 + height * 0.5) );

        if ( cull < limit ) {
            
            this.#makeCloud( position, nSamples, 1 - (cull / limit) );
        }
    }

    #makeCloud( position, nSamples, cull ) {

        const cloud = new Cloud( this.#clouds.game, {} );

        cloud.position.copyFrom( position );

        EngineUtils.setDirection( cloud, position.negate(), 0, -Math.PI / 2, 0 );
        EngineUtils.rotate( cloud, BABYLON.Axis.Y, Math.random() * Math.PI * 2 );

        cloud.scaling.copyFromFloats( Math.random(), Math.random(), Math.random() ).scaleInPlace( 0.2 );
        cloud.scaling.addInPlaceFromFloats( 0.7, 0.6, 0.7 );
        cloud.scaling.scaleInPlace( 2 + cull * 3 ).scaleInPlace( 100 * 2 );

        cloud.parent = this.#planet.root;
        cloud.randomValue = Math.random() * nSamples;
        cloud.planetRadius = this.#planet.config.radius + this.#planet.config.maxHeight * 0.5;

        cloud.post();
        this.list.push( cloud );
    }

    #noise( vector ) {

        if ( typeof vector === "number" ) {

            return this.#perlin.get( vector, vector, vector );
        }

        return this.#perlin.get( vector.x, vector.y, vector.z );
    }

    #updateLODs( distance, radiusDistance ) {

        const planetToCamera = this.#planet.game.camera.position.subtract( this.#planet.position ).normalize();
        const occlusionFallOf = this.#planet.helper.getOcclusionFallOf( distance ).clamp( -0.1, Infinity );
        const distanceLODLevel = (radiusDistance / CloudsPlanet.LOD_LIMIT).clamp( 0, 1 );

        const starLightDirection = this.#planet.position.normalizeToNew().applyRotationQuaternionInPlace( this.#planet.rotationQuaternion.invert() );
        
        for ( let i = 0; i < this.list.length; i++ ) {

            this.#updateCloud( this.list[i], planetToCamera, occlusionFallOf, distanceLODLevel, starLightDirection );
        }
    }

    #updateCloud( cloud, planetToCamera, occlusionFallOf, distanceLODLevel, starLightDirection ) {

        const cloudWorld = BABYLON.Vector3.TransformCoordinates( cloud.position, this.#planet.root._worldMatrix );
        const dot = BABYLON.Vector3.Dot( planetToCamera, cloudWorld.subtract( this.#planet.position ).normalize() );
        
        if ( dot > occlusionFallOf ) {
            
            cloud.set( Math.round( cloud.levels.length * ((1 - dot) + distanceLODLevel) * 0.5 ).clamp( 0, cloud.levels.length - 1 )  );
            cloud.updateStarLightDirection( starLightDirection );

        } else {

            cloud.setEnabled( false );
        }
    }

}