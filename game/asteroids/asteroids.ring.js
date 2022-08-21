"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AsteroidsRing {

    config = {

        key: UUIDv4(),

        radius: 1000,
        spread: 200,
        density: 0.05,
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
        this.#spawnClusters();
    }

    get position() {
        
        return this.root.position;
    }

    get rotationQuaternion() {
        
        return this.root.rotationQuaternion;
    }

    update() {

        this.list.forEach( ( cluster ) => cluster.update() );
    }

    #createRoot() {

        this.root = new BABYLON.TransformNode( `asteroids_ring${ this.config.key }`, this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    #spawnClusters() {

        const count = Math.floor( ( Math.PI * 2 * this.config.radius ) / ( this.config.spread * 2 ) );
        
        for ( let i = 0; i < count; i++ ) {

            const angle = ( 360 / count ) * i * EngineUtils.toRadian;

            const cluster = new AsteroidsCluster( this.manager, { key: i, radius: this.config.spread, density: this.config.density } );
            cluster.position.copyFromFloats( Math.cos( angle ), 0, Math.sin( angle ) ).scaleInPlace( this.config.radius );
            cluster.parent = this.root;

            this.list.add( cluster );
        }
    }

}