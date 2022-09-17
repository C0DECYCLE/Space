"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AsteroidsCluster {

    config = {

        key: UUIDv4(),
        seed: undefined,

        radius: 1000,
        height: 1000,
        density: 0.1,

        offset: null
    };

    game = null;
    scene = null;

    list = [];
    root = null;

    #hasCustomParent = false;

    constructor( game, config, customParent = null ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure.call( this, config );

        this.#createRoot( customParent );
        this.#spawnAsteroids();
    }

    get position() {
        
        if ( this.#hasCustomParent === false ) {

            return this.root.position;     

        } else {

            console.warn( "AsteroidCluster: Doesn't has a own position." );
        }
    }

    get rotationQuaternion() {
        
        if ( this.#hasCustomParent === false ) {

            return this.root.rotationQuaternion;     

        } else {

            console.warn( "AsteroidCluster: Doesn't has a own rotationQuaternion." );
        }
    }

    get numberOfAsteroids() {

        return this.list.length;
    }

    set parent( value ) {

        if ( this.#hasCustomParent === false ) {

            this.root.parent = value;     

        } else {

            this.root = value;

            for ( let i = 0; i < this.list.length; i++ ) {

                this.list[i].parent = this.root;
            }
        }
    }
    
    update() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    offsetAllAsteroids( position ) {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].position.addInPlace( position );
        }
    }

    #createRoot( customParent = null ) {

        this.#hasCustomParent = customParent !== null;

        if ( this.#hasCustomParent === true ) {

            this.root = customParent;

        } else {

            this.root = new BABYLON.TransformNode( `asteroids_cluster${ this.config.key }`, this.scene );
            this.root.rotationQuaternion = this.root.rotation.toQuaternion();
        }
    }

    #spawnAsteroids() {

        const random = this.config.seed !== undefined && typeof this.config.seed === "function" ? this.config.seed : new Math.seedrandom( this.config.seed );
        const count = ( ( 2 * this.config.radius + this.config.height ) / 3 ) * this.config.density;
        const spread = new BABYLON.Vector3( this.config.radius, this.config.height, this.config.radius );

        for ( let i = 0; i < count; i++ ) {
            
            const asteroid = new Asteroid( this.game, { random: random } );
            asteroid.position.copyFromFloats( random() * 2 - 1, random() * 2 - 1, random() * 2 - 1 ).multiplyInPlace( spread );
            asteroid.parent = this.root;

            if ( this.config.offset !== null ) {

                asteroid.position.addInPlace( this.config.offset );
            }

            this.list.push( asteroid );
        }
    }

}