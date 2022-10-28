/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudsPlanet extends EntitySpawnerPlanet {

    static LOD_LIMIT = 2 ** 2.5;

    config = {

        color: "#ffffff",
        
        cullScale: 0.00175,
        limit: 0.35,
        mainScale: 1.5,
        heightScale: 1.0
    };

    material = null;
    models = null;

    #clouds = null;

    /* override */ constructor( clouds, planet, config ) {

        super( planet, config );

        this.#clouds = clouds;

        EngineUtils.configure.call( this, config );

        this.#setupModels();
        this.#setupFilters();
        this.spawn();
        this.#register();
    }

    /* override */ create( position, n, varyings ) {
        
        const height = this.noise( position.clone().scaleInPlace( this.planet.config.radius * -this.config.cullScale * 2.5 ).addInPlace( varyings.noiseOffset ) );

        const cloud = new Cloud( this.#clouds.game, this.models, {} );

        cloud.position.copyFrom( position ).scaleInPlace( this.planet.config.radius + this.planet.config.maxHeight * (0.5 + height * 0.5) * this.config.heightScale );

        EngineUtils.setDirection( cloud.rotationQuaternion, cloud.position, 0, Math.PI / 2, 0 );
        EngineUtils.rotate( cloud.rotationQuaternion, BABYLON.Axis.Y, Math.random() * Math.PI * 2 );

        cloud.scaling.copyFromFloats( Math.random(), Math.random(), Math.random() ).scaleInPlace( 0.25 );
        cloud.scaling.addInPlaceFromFloats( 0.75, 0.5, 0.75 );
        cloud.scaling.scaleInPlace( 2 + varyings.cull * 3 ).scaleInPlace( 100 * this.config.mainScale );

        cloud.parent = this.planet.root;
        cloud.randomValue = Math.random() * n;
        cloud.post();

        return [ cloud, {} ];
    }

    update( distance ) {

        if ( this.planet.lod.isVisible === true ) {

            this.#updateClouds( distance );
        }
    }

    #setupModels() {

        this.material = this.#clouds.materials.get( this.config.color ) || new CloudMaterial( this.#clouds, this.config.color );
        this.models = this.#clouds.createModels( Clouds.lods, this.material );
    }

    #setupFilters() {

        this.addPreFilter( position => this.#cull_filter( position ) );
    }

    #cull_filter( position ) {
        
        const noiseOffset = new BABYLON.Vector3( this.planet.position.x, this.config.seed, this.planet.position.z );
        const cull = this.noise( position.clone().scaleInPlace( this.planet.config.radius * this.config.cullScale ).addInPlace( noiseOffset ) );

        if ( cull < this.config.limit ) {

            return { noiseOffset: noiseOffset, cull: 1 - (cull / this.config.limit) };
        }

        return false;
    }

    #register() {

        this.#clouds.list.push( this );
    }


    /////////////////////////////////////////////////////////////////

    #updateClouds( distance ) {

        const radiusDistance = distance / this.planet.config.radius;
        const planetToCamera = this.planet.game.camera.position.subtract( this.planet.position ).normalize();
        const occlusionFallOf = this.planet.helper.getOcclusionFallOf( distance ).clamp( -0.35, Infinity );
        const distanceLODLevel = (radiusDistance / CloudsPlanet.LOD_LIMIT).clamp( 0, 1 );
        const starLightDirection = this.planet.position.normalizeToNew().applyRotationQuaternionInPlace( this.planet.rotationQuaternion.invert() );

        for ( let i = 0; i < this.list.length; i++ ) {

            this.#updateLOD( this.list[i], radiusDistance, planetToCamera, occlusionFallOf, distanceLODLevel );
            this.#updateStarLight( this.list[i], starLightDirection );
        }
    }

    #updateLOD( cloud, radiusDistance, planetToCamera, occlusionFallOf, distanceLODLevel ) {

        const cloudWorld = BABYLON.Vector3.TransformCoordinates( cloud.position, this.planet.root._worldMatrix );
        const dot = BABYLON.Vector3.Dot( planetToCamera, cloudWorld.subtract( this.planet.position ).normalize() );
        
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