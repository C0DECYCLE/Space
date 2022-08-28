"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Spaceship {

    config = {

        key: UUIDv4()
    };

    manager = null;
    scene = null;
    spaceships = null;

    lod = null;
    physics = null;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;
        this.spaceships = this.manager.spaceships;

        EngineUtils.configure( this.config, config );
        
        this.#createLod();   
        this.#addPhysics();
    }

    get root() {

        return this.lod.root;
    }

    get position() {
        
        return this.lod.position;
    }

    get rotationQuaternion() {
        
        return this.lod.rotationQuaternion;
    }

    update() {

        this.lod.update();
        this.physics.update();
    }

    #createLod() {
        
        this.lod = new LOD( this.manager );
        this.lod.fromModels( this.spaceships.model, mesh => {

            this.manager.star.shadow.cast( mesh, true, false );
            this.manager.postprocess.register( mesh );
        } );
    }

    #addPhysics() {

        this.physics = new PhysicsEntity( this.root, PhysicsEntity.TYPES.DYNAMIC );
        //this.physics.pause();
    }

}