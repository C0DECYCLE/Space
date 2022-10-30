"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetSurfaceObsticle extends EntityLOD implements IPlanetSurfaceObsticle, ISpawnable {

    config = {

        random: Math.random
    };

    variant = undefined;
    models = null;

    constructor( game, obsticle, config ) {

        super( game, ( instance, value ) => { 

            this.game.star.shadow.cast( instance, value );  

        }, true );

        EngineUtils.configure.call( this, config );
        
        this.#pickVariant( obsticle );
        this.#createModels();   
        this.#makeUnique();
        this.#post();
    }

    #pickVariant( obsticle ) {

        const variants = this.game.planets.obsticles[ obsticle ].keys;
        
        this.variant = variants[ Math.round( variants.length * Math.random() ).clamp( 0, variants.length - 1 ) ];
        this.models = this.game.planets.obsticles[ obsticle ][ this.variant ];
    }

    #createModels() {

        this.fromModels( this.models );
    }

    #makeUnique() {

        this.rotationQuaternion.copyFrom( new BABYLON.Vector3( this.config.random() * 2 - 1, this.config.random() * 2 - 1, this.config.random() * 2 - 1 ).scaleInPlace( Math.PI ).toQuaternion() );
        this.scaling.scaleInPlace( 0.8 + this.config.random() * 0.4 );
    }

    #post() {
 
        this.setBounding( EngineUtils.createBoundingCache( this.models[0], this.scaling ) );
    }
    
}