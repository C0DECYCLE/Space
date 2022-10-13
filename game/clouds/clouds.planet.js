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
        cullScale: 0.001,
        limit: 0.35,
        mainScale: 2
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
        this.#register();
    }

    update( distance ) {

        if ( this.#planet.lod.isVisible === true ) {

            this.#updateClouds( distance );
        }
    }

    #setupPerlin() {

        this.config.seed = this.config.seed || this.#planet.config.seed.y;

        this.#perlin = new perlinNoise3d();
        this.#perlin.noiseSeed( this.config.seed );
    }

    #register() {

        this.#clouds.list.push( this );
    }

    #spawnClouds() {

        const planetSurfaceArea = 4 * Math.PI * this.#planet.config.radius;
        const nSamples = Math.floor( planetSurfaceArea * this.config.density );
        
        for ( let i = 0; i < nSamples; i++ ) {

            this.#evalCloud( this.#getPosition( i, nSamples ), nSamples );
        }
    }

    #evalCloud( position, nSamples ) {
        
        const noiseOffset = new BABYLON.Vector3( this.#planet.position.x, this.config.seed, this.#planet.position.z );
        const cull = this.#noise( position.clone().scaleInPlace( this.#planet.config.radius * this.config.cullScale ).addInPlace( noiseOffset ) );

        if ( cull < this.config.limit ) {
            
            this.#makeCloud( this.#placeAtHeight( position, noiseOffset ), nSamples, 1 - (cull / this.config.limit) );
        }
    }

    #makeCloud( position, nSamples, cull ) {

        const cloud = new Cloud( this.#clouds.game, {} );

        cloud.position.copyFrom( position );

        EngineUtils.setDirection( cloud, position.negate(), 0, -Math.PI / 2, 0 );
        EngineUtils.rotate( cloud, BABYLON.Axis.Y, Math.random() * Math.PI * 2 );

        cloud.scaling.copyFromFloats( Math.random(), Math.random(), Math.random() ).scaleInPlace( 0.2 );
        cloud.scaling.addInPlaceFromFloats( 0.7, 0.6, 0.7 );
        cloud.scaling.scaleInPlace( 2 + cull * 3 ).scaleInPlace( 100 * this.config.mainScale );

        cloud.parent = this.#planet.root;
        cloud.randomValue = Math.random() * nSamples;
        cloud.post();

        this.list.push( cloud );
    }

    #getPosition( i, nSamples ) {

        const theta = 2 * Math.PI * i / Math.PHI;
        const phi = Math.acos( 1 - 2 * ( i + 0.5 ) / nSamples );

        return new BABYLON.Vector3( Math.cos( theta ) * Math.sin( phi ), Math.sin( theta ) * Math.sin( phi ), Math.cos( phi ) ); 
    }

    #placeAtHeight( position, noiseOffset ) {

        const height = this.#noise( position.clone().scaleInPlace( this.#planet.config.radius * -this.config.cullScale * 2.5 ).addInPlace( noiseOffset ) );

        position.scaleInPlace( this.#planet.config.radius + this.#planet.config.maxHeight * (0.5 + height * 0.5) );

        return position;
    }

    #noise( vector ) {

        if ( typeof vector === "number" ) {

            return this.#perlin.get( vector, vector, vector );
        }

        return this.#perlin.get( vector.x, vector.y, vector.z );
    }

    #updateClouds( distance ) {

        const radiusDistance = distance / this.#planet.config.radius;
        const planetToCamera = this.#planet.game.camera.position.subtract( this.#planet.position ).normalize();
        const occlusionFallOf = this.#planet.helper.getOcclusionFallOf( distance ).clamp( -0.35, Infinity );
        const distanceLODLevel = (radiusDistance / CloudsPlanet.LOD_LIMIT).clamp( 0, 1 );
        const starLightDirection = this.#planet.position.normalizeToNew().applyRotationQuaternionInPlace( this.#planet.rotationQuaternion.invert() );

        for ( let i = 0; i < this.list.length; i++ ) {

            this.#updateLOD( this.list[i], radiusDistance, planetToCamera, occlusionFallOf, distanceLODLevel );
            this.#updateStarLight( this.list[i], starLightDirection );
        }
    }

    #updateLOD( cloud, radiusDistance, planetToCamera, occlusionFallOf, distanceLODLevel ) {

        const cloudWorld = BABYLON.Vector3.TransformCoordinates( cloud.position, this.#planet.root._worldMatrix );
        const dot = BABYLON.Vector3.Dot( planetToCamera, cloudWorld.subtract( this.#planet.position ).normalize() );
        
        if ( dot > occlusionFallOf ) {
            
            if ( radiusDistance < CloudsPlanet.LOD_LIMIT ) {

                cloud.set( Math.round( cloud.levels.length * ((1 - dot) + distanceLODLevel) * 0.5 ).clamp( 0, cloud.levels.length - 1 )  );

            } else {

                cloud.set( cloud.levels.length - 1 );
            }

        } else {

            cloud.setEnabled( false );
        }
    }

    #updateStarLight( cloud, starLightDirection ) {

        if ( cloud.isVisible === true ) {
                
            cloud.updateStarLightDirection( starLightDirection );
        }
    }

}