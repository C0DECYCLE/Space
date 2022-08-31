"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Physics {

    config = {

    };

    game = null;
    scene = null;

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure( this.config, config );

        this.#setupCollisions();
    }
    
    #setupCollisions() {

        this.scene.gravity = BABYLON.Vector3.Zero();
        this.scene.checkCollisions = true;
    }

}