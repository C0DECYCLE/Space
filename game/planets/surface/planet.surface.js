"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetSurface {

    static LOD_LIMIT = 2.0;

    config = {

        seed: undefined,
        
        density: 4.0,
        cullScale: 0.002,
        limit: 0.4
    };

    list = [];

    #planet = null;
    #perlin = null;

    constructor( planet, config ) {

        this.#planet = planet;

        EngineUtils.configure.call( this, config );

        this.#setupPerlin();
        this.#spawnObsticles();
    }

    update( distance ) {
        
        if ( this.#planet.lod.isVisible === true ) {

            this.#updateObsticles( distance );
        }
    }

    #setupPerlin() {

        this.config.seed = this.config.seed || this.#planet.config.seed.y;

        this.#perlin = new perlinNoise3d();
        this.#perlin.noiseSeed( this.config.seed );
    }

    #spawnObsticles() {

        const planetSurfaceArea = 4 * Math.PI * this.#planet.config.radius;
        const nSamples = Math.floor( planetSurfaceArea * this.config.density );
        
        for ( let i = 0; i < nSamples; i++ ) {

            this.#evalObsticle( this.#getPosition( i, nSamples ) );
        }
    }

    #evalObsticle( position ) {
        
        const noiseOffset = new BABYLON.Vector3( this.#planet.position.x, this.config.seed, this.#planet.position.z );
        const cull = this.#noise( position.clone().scaleInPlace( this.#planet.config.radius * this.config.cullScale ).addInPlace( noiseOffset ) );

        if ( cull < this.config.limit ) {
            
            this.#makeObsticle( PlanetUtils.displace( this.#planet, position ) );
        }
    }

    #makeObsticle( position ) {
        
        const obsticle = new PlanetSurfaceObsticle( this.#planet.game, "tree", {} );

        obsticle.position.copyFrom( position );
        EngineUtils.setDirection( obsticle.rotationQuaternion, position, 0, Math.PI / 2, 0 );
        EngineUtils.rotate( obsticle.rotationQuaternion, BABYLON.Axis.Y, Math.random() * Math.PI * 2 );
        
        
        const left = PlanetUtils.displace( this.#planet, BABYLON.Vector3.Left().scaleInPlace( 10 ).applyRotationQuaternionInPlace( obsticle.rotationQuaternion ).addInPlace( position ).normalize() ).subtractInPlace( position );
        const forward = PlanetUtils.displace( this.#planet, BABYLON.Vector3.Forward().scaleInPlace( 10 ).applyRotationQuaternionInPlace( obsticle.rotationQuaternion ).addInPlace( position ).normalize() ).subtractInPlace( position );
        const steepUp = BABYLON.Vector3.Cross( left, forward ).normalize();

        EngineUtils.setDirection( obsticle.rotationQuaternion, steepUp, 0, Math.PI / 2, 0 );


        if ( BABYLON.Vector3.Dot( steepUp, position.normalizeToNew() ) > 0.95 ) {

            obsticle.parent = this.#planet.root;
            this.list.push( obsticle );
        }
    }

    #getPosition( i, nSamples ) {

        const theta = 2 * Math.PI * i / Math.PHI;
        const phi = Math.acos( 1 - 2 * ( i + 0.5 ) / nSamples );

        return new BABYLON.Vector3( Math.cos( theta ) * Math.sin( phi ), Math.sin( theta ) * Math.sin( phi ), Math.cos( phi ) ); 
    }

    #noise( vector ) {

        if ( typeof vector === "number" ) {

            return this.#perlin.get( vector, vector, vector );
        }

        return this.#perlin.get( vector.x, vector.y, vector.z );
    }

    
    #updateObsticles( distance ) {

        const radiusDistance = distance / this.#planet.config.radius;
        const planetToCamera = this.#planet.game.camera.position.subtract( this.#planet.position ).normalize();
        const occlusionFallOf = this.#planet.helper.getOcclusionFallOf( distance ).clamp( 0.85, Infinity );
        const distanceLODLevel = (radiusDistance / PlanetSurface.LOD_LIMIT).clamp( 0, 1 );
        
        for ( let i = 0; i < this.list.length; i++ ) {

            this.#updateLOD( this.list[i], radiusDistance, planetToCamera, occlusionFallOf, distanceLODLevel );
        }
    }

    #updateLOD( obsticle, radiusDistance, planetToCamera, occlusionFallOf, distanceLODLevel ) {

        const obsticleWorld = BABYLON.Vector3.TransformCoordinates( obsticle.position, this.#planet.root._worldMatrix );
        const dot = BABYLON.Vector3.Dot( planetToCamera, obsticleWorld.subtract( this.#planet.position ).normalize() );
        
        if ( dot > occlusionFallOf ) {
            
            if ( radiusDistance < PlanetSurface.LOD_LIMIT ) {

                obsticle.set( Math.round( obsticle.levels.length * ((1 - dot) + distanceLODLevel) * 0.5 ).clamp( 0, obsticle.levels.length - 1 )  );

            } else {

                obsticle.setEnabled( false );
                //obsticle.set( obsticle.levels.length - 1 );
            }

        } else {

            obsticle.setEnabled( false );
        }
    }
    
}