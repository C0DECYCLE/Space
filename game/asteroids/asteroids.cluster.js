"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AsteroidsCluster {

    config = {

        key: UUIDv4(),

        radius: 1000,
        height: 1000,
        density: 0.1,
    };

    manager = null;
    scene = null;

    list = [];
    root = null;

    #hasCustomParent = false;

    constructor( manager, config, customParent = null ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        EngineUtils.configure( this.config, config );

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

        const count = ( ( 2 * this.config.radius + this.config.height ) / 3 ) * this.config.density;
        const spread = new BABYLON.Vector3( this.config.radius, this.config.height, this.config.radius );

        for ( let i = 0; i < count; i++ ) {

            const asteroid = new Asteroid( this.manager, {} );
            asteroid.position.copyFromFloats( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).multiplyInPlace( spread );
            asteroid.parent = this.root;

            this.list.push( asteroid );
        }
    }

}