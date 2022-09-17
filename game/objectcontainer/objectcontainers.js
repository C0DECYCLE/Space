"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainers {

    config = {

    };

    game = null;

    spatialhash = null;

    #mainIndex = undefined;
    #mainGrid = null;
    //#mainContainer = null;

    constructor( game, config ) {

        this.game = game;

        EngineUtils.configure.call( this, config );

        this.#setupSpatialHash();
    }

    get mainIndex() {

        return this.#mainIndex;
    }

    get mainGrid() {

        return this.#mainGrid;
    }

    add( node ) {

        this.spatialhash.add( node );
    }

    addAll( nodes ) {

        nodes.forEach( node => this.add( node ) );
    }

    update() {
        
        this.#mainGrid = ObjectContainerUtils.positionToGrid( this.game.camera.position );
        this.#mainIndex = ObjectContainerUtils.gridToIndex( this.#mainGrid );

        /*
        if ( this.#mainContainer === null || this.#mainContainer.index !== this.#mainIndex ) {

            this.#mainContainer = this.spatialhash.get( this.#mainIndex );
        }
        */
    }

    debug() {

        this.spatialhash.debug();
    }

    #setupSpatialHash() {

        this.spatialhash = new ObjectContainersSpatialHash( this );
    }

}