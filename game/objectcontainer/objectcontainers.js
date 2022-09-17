"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainers {

    config = {

    };

    spatialhash = null;

    #game = null;

    #mainIndex = undefined;
    #mainGrid = null;
    //#mainContainer = null;

    constructor( game, config ) {

        this.#game = game;

        EngineUtils.configure.call( this, config );

        this.#setupSpatialHash();
    }

    get mainIndex() {

        return this.#mainIndex;
    }

    get mainGrid() {

        return this.#mainGrid;
    }

    update() {
        
        this.#mainGrid = ObjectContainerUtils.positionToGrid( this.#game.camera.position );
        this.#mainIndex = ObjectContainerUtils.gridToIndex( this.#mainGrid );

        /*
        if ( this.#mainContainer === null || this.#mainContainer.index !== this.#mainIndex ) {

            this.#mainContainer = this.spatialhash.get( this.#mainIndex );
        }
        */
    }

    #setupSpatialHash() {

        this.spatialhash = new ObjectContainersSpatialHash( this );
    }

}