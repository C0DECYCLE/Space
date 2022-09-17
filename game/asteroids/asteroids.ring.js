"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AsteroidsRing {

    config = {

        key: UUIDv4(),
        seed: undefined,

        radius: 1000,
        spread: 200,
        height: 200,
        density: 0.05,
    };

    game = null;
    scene = null;

    list = [];
    root = null;
    
    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure.call( this, config );

        this.#createRoot();
        this.#spawnClusters();
    }

    get position() {
        
        return this.root.position;
    }

    get rotationQuaternion() {
        
        return this.root.rotationQuaternion;
    }

    get numberOfClusters() {

        return this.list.length;
    }

    get numberOfAsteroids() {

        let count = 0;

        for ( let i = 0; i < this.list.length; i++ ) {

            count += this.list[i].numberOfAsteroids;
        }

        return count;
    }

    update() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    #createRoot() {

        this.root = new BABYLON.TransformNode( `asteroids_ring${ this.config.key }`, this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    #spawnClusters() {

        const random = new Math.seedrandom( this.config.seed );
        const count = Math.floor( ( Math.PI * 2 * this.config.radius ) / ( this.config.spread * 2 ) );
        
        for ( let i = 0; i < count; i++ ) {

            const angle = ( 360 / count ) * i * EngineUtils.toRadian;
            const offset = new BABYLON.Vector3( Math.cos( angle ), 0, Math.sin( angle ) ).scaleInPlace( this.config.radius );

            const cluster = new AsteroidsCluster( this.game, { key: i, seed: random, radius: this.config.spread, height: this.config.height, density: this.config.density, offset: offset }, this.root );

            this.list.push( cluster );
        }
    }

}