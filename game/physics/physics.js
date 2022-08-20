"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Physics {

    config = {

    };

    manager = null;
    scene = null;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        EngineUtils.configure( this.config, config );

        this.#setupCollisions();
    }
    
    #setupCollisions() {

        this.scene.gravity = BABYLON.Vector3.Zero();
        this.scene.checkCollisions = true;
    }

}