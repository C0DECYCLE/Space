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

    #mainPosition = new BABYLON.Vector3();
    #mainContainer = null;

    constructor( game, config ) {

        this.#game = game;

        EngineUtils.configure.call( this, config );

        this.#setupSpatialHash();
    }

    get mainPosition() {

        return this.#mainPosition;
    }

    insert( position ) {
        
        this.#mainPosition.copyFrom( position );

        const index = ObjectContainerUtils.positionToIndex( this.#mainPosition );

        if ( this.#mainContainer === null || this.#mainContainer.index !== index ) {

            this.#mainContainer = this.spatialhash.get( index );
        }
    }

    #setupSpatialHash() {

        this.spatialhash = new ObjectContainersSpatialHash( this );
    }

}