"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroid {

    config = {

        random: Math.random,

        width: () => Math.ceil( this.config.random() * 5 ) + 5,
        height: () => Math.ceil( this.config.random() * 5 ) + 5,
        depth: () => Math.ceil( this.config.random() * 5 ) + 5,

        scale: () => Math.ceil( this.config.random() * 5 )
    };

    game = null;
    scene = null;
    asteroids = null;

    variant = undefined;
    lod = null;

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;
        this.asteroids = this.game.asteroids;

        EngineUtils.configure.call( this, config );
        
        this.#pickVariant();
        this.#createLod();   
        this.#makeUnique();
        this.post();
    }

    get position() {
        
        return this.lod.position;
    }

    get rotationQuaternion() {
        
        return this.lod.rotationQuaternion;
    }

    get scaling() {
        
        return this.lod.scaling;
    }

    set parent( value ) {

        this.lod.parent = value;
    }

    update() {

        this.lod.update();
    }

    post() {

        this.lod.setBounding( EngineUtils.createBoundingCache( this.asteroids.variants[ this.variant ][0], this.scaling ) );
    }

    #pickVariant() {

        const variants = this.asteroids.variants.keys;
        
        this.variant = variants[ Math.round( variants.length * Math.random() ).clamp( 0, variants.length - 1 ) ];
    }

    #createLod() {

        this.lod = new EntityLOD( this.game, true, true );
        this.lod.fromModels( this.asteroids.variants[ this.variant ] );
    }

    #makeUnique() {

        this.rotationQuaternion.copyFrom( new BABYLON.Vector3( this.config.random() * 2 - 1, this.config.random() * 2 - 1, this.config.random() * 2 - 1 ).scaleInPlace( Math.PI ).toQuaternion() );
        //this.scaling.copyFromFloats( this.config.width(), this.config.height(), this.config.depth() ).scaleInPlace( this.config.scale() );
    }

}