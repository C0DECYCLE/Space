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

    #isPaused = false;

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure.call( this, config );

        this.#setupCollisions();
    }

    get isPaused() {

        return this.#isPaused;
    }

    pause() {

        this.#isPaused = true;
    }

    resume() {

        this.#isPaused = false;
    }
    
    #setupCollisions() {

        this.scene.gravity = BABYLON.Vector3.Zero();
        this.scene.collisionsEnabled = true;
    }

}