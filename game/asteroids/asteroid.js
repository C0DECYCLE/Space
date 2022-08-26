"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroid {

    config = {

        width: Math.ceil( Math.random() * 5 ) + 5,
        height: Math.ceil( Math.random() * 5 ) + 5,
        depth: Math.ceil( Math.random() * 5 ) + 5,

        scale: Math.ceil( Math.random() * 5 )
    };

    manager = null;
    scene = null;
    asteroids = null;

    root = null;
    mesh = null;
    physics = null;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;
        this.asteroids = this.manager.asteroids;

        EngineUtils.configure( this.config, config );
        
        this.#createMesh();    
        this.#createRoot();
        this.#addPhysics();
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
        
        this.physics.update();
    }

    #createMesh() {
        
        this.mesh = this.scene.instance( this.asteroids.asteroidModels[0], mesh => {

            this.manager.star.shadow.cast( mesh, true, false );
            this.manager.postprocess.register( mesh );
        } );

        this.mesh.scaling.copyFromFloats( this.config.width, this.config.height, this.config.depth ).scaleInPlace( this.config.scale );
        this.mesh.rotation.copyFromFloats( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).scaleInPlace( Math.PI );
    }
    
    #createRoot() {

        this.root = this.mesh;
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    #addPhysics() {

        this.physics = new PhysicsEntity( this.root, PhysicsEntity.TYPES.DYNAMIC );
        //this.physics.pause();
    }

}