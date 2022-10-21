"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetSurface extends EntitySpawner {

    static LOD_LIMIT = 2.0;

    config = {
        
        density: 5.0,
        cullScale: 0.002,
        limit: 0.4
    };

    /* override */ constructor( planet, config ) {

        super( planet, config );

        EngineUtils.configure.call( this, config );

        this.#setupFilters();
        this.spawn();
    }

    /* override */ create( position, n, varyings ) {
        
        const obsticle = new PlanetSurfaceObsticle( this.planet.game, "tree", {} );

        obsticle.position.copyFrom( PlanetUtils.displace( this.planet, position ) );
        EngineUtils.setDirection( obsticle.rotationQuaternion, obsticle.position, 0, Math.PI / 2, 0 );
        EngineUtils.rotate( obsticle.rotationQuaternion, BABYLON.Axis.Y, Math.random() * Math.PI * 2 );
        
        const left = PlanetUtils.displace( this.planet, BABYLON.Vector3.Left().scaleInPlace( 10 ).applyRotationQuaternionInPlace( obsticle.rotationQuaternion ).addInPlace( position ).normalize() ).subtractInPlace( position );
        const forward = PlanetUtils.displace( this.planet, BABYLON.Vector3.Forward().scaleInPlace( 10 ).applyRotationQuaternionInPlace( obsticle.rotationQuaternion ).addInPlace( position ).normalize() ).subtractInPlace( position );
        const steepUp = BABYLON.Vector3.Cross( left, forward ).normalize();

        EngineUtils.setDirection( obsticle.rotationQuaternion, steepUp, 0, Math.PI / 2, 0 );

        obsticle.parent = this.planet.root;

        return [ obsticle, { steepUp: steepUp } ];
    }

    update( distance ) {
        
        if ( this.planet.lod.isVisible === true ) {

            this.#updateObsticles( distance );
        }
    }

    #setupFilters() {

        this.addPreFilter( position => this.#cull_filter( position ) );
        this.addPostFilter( ( obsticle, varyings ) => this.#steep_filter( obsticle, varyings ) );
    }

    #cull_filter( position ) {
        
        const noiseOffset = new BABYLON.Vector3( this.planet.position.x, this.config.seed, this.planet.position.z );
        const cull = this.noise( position.clone().scaleInPlace( this.planet.config.radius * this.config.cullScale ).addInPlace( noiseOffset ) );

        if ( cull < this.config.limit ) {

            return {};
        }

        return false;
    }

    #steep_filter( obsticle, varyings ) {

        return BABYLON.Vector3.Dot( varyings.steepUp, obsticle.position.normalizeToNew() ) > 0.95;
    }


    /////////////////////////////////////////////////////////////////
    
    #updateObsticles( distance ) {

        const radiusDistance = distance / this.planet.config.radius;
        const planetToCamera = this.planet.game.camera.position.subtract( this.planet.position ).normalize();
        const occlusionFallOf = this.planet.helper.getOcclusionFallOf( distance ).clamp( 0.85, Infinity );
        const distanceLODLevel = (radiusDistance / PlanetSurface.LOD_LIMIT).clamp( 0, 1 );
        
        for ( let i = 0; i < this.list.length; i++ ) {

            this.#updateLOD( this.list[i], radiusDistance, planetToCamera, occlusionFallOf, distanceLODLevel );
        }
    }

    #updateLOD( obsticle, radiusDistance, planetToCamera, occlusionFallOf, distanceLODLevel ) {

        const obsticleWorld = BABYLON.Vector3.TransformCoordinates( obsticle.position, this.planet.root._worldMatrix );
        const dot = BABYLON.Vector3.Dot( planetToCamera, obsticleWorld.subtract( this.planet.position ).normalize() );
        
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