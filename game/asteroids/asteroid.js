"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroid extends EntityLOD {

    config = {

        random: Math.random
    };

    variant = undefined;
    models = null;

    constructor( game, config ) {

        super( game, ( instance, value ) => { 

            this.game.star.shadow.cast( instance, value );  

        }, true );

        EngineUtils.configure.call( this, config );
        
        this.#pickVariant();
        this.#createModels();   
        this.#makeUnique();
        this.#post();
    }

    #pickVariant() {

        const variants = this.game.asteroids.variants.keys;
        
        this.variant = variants[ Math.round( variants.length * Math.random() ).clamp( 0, variants.length - 1 ) ];
        this.models = this.game.asteroids.variants[ this.variant ];
    }

    #createModels() {

        this.fromModels( this.models );
    }

    #makeUnique() {

        this.rotationQuaternion.copyFrom( new BABYLON.Vector3( this.config.random() * 2 - 1, this.config.random() * 2 - 1, this.config.random() * 2 - 1 ).scaleInPlace( Math.PI ).toQuaternion() );
    }

    #post() {

        this.setBounding( EngineUtils.createBoundingCache( this.models[0], this.scaling ) );
    }
    
}