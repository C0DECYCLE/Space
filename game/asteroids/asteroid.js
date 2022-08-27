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

    lod = null;
    physics = null;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;
        this.asteroids = this.manager.asteroids;

        EngineUtils.configure( this.config, config );
        
        this.#createLod();   
        this.#addPhysics();
    }

    get position() {
        
        return this.lod.position;
    }

    get rotationQuaternion() {
        
        return this.lod.rotationQuaternion;
    }

    set parent( value ) {

        this.lod.parent = value;
    }

    update() {

        this.lod.update();
        this.physics.update();
    }

    #createLod() {
        
        this.lod = new LOD( this.manager );
        this.lod.fromModels( this.asteroids.models, mesh => {

            this.manager.star.shadow.cast( mesh, true, false );
            this.manager.postprocess.register( mesh );
        } );

        this.lod.scaling.copyFromFloats( this.config.width, this.config.height, this.config.depth ).scaleInPlace( this.config.scale );
        this.lod.rotationQuaternion.copyFrom( new BABYLON.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).scaleInPlace( Math.PI ).toQuaternion() );
    }

    #addPhysics() {

        this.physics = new PhysicsEntity( this.lod.root, PhysicsEntity.TYPES.DYNAMIC );
        //this.physics.pause();
    }

}