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
        density: 0.1,
    };

    manager = null;
    scene = null;

    list = new Set(); 
    root = null;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        EngineUtils.configure( this.config, config );

        this.#createRoot();
        this.#spawnAsteroids();
    }

    get position() {
        
        return this.root.position;
    }

    get rotationQuaternion() {
        
        return this.root.rotationQuaternion;
    }

    set parent( value ) {

        this.root.parent = value;
    }
    
    update() {

        this.list.forEach( ( asteroid ) => asteroid.update() );
    }

    #createRoot() {

        this.root = new BABYLON.TransformNode( `asteroids_cluster${ this.config.key }`, this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    #spawnAsteroids() {

        const count = this.config.radius * this.config.density;
        
        for ( let i = 0; i < count; i++ ) {

            const asteroid = new Asteroid( this.manager, {} );
            asteroid.position.copyFromFloats( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).scaleInPlace( this.config.radius );
            asteroid.parent = this.root;

            this.list.add( asteroid );
        }
    }

}