"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainer {

    static size = 128;

    #containers = null;

    #index = undefined;
    #grid = null;
    #list = new ObjectArray();

    #distanceCache = undefined;
    #cacheMainIndex = undefined;

    constructor( containers, index ) {

        this.#containers = containers;
        this.#index = index;
        this.#grid = ObjectContainerUtils.indexToGrid( this.#index );
    }

    get index() {

        return this.#index;
    }

    get nodes() {

        return this.#list;
    }

    get distance() {

        if ( this.#distanceCache === undefined || this.#cacheMainIndex !== this.#containers.mainIndex ) {

            this.#distanceCache = this.#getDistance();
            this.#cacheMainIndex = this.#containers.mainIndex;
        }

        return this.#distanceCache;
    }

    store( node ) {

        this.#list.add( node );

        return this;
    }

    unstore( node ) {

        this.#list.remove( node );

        if ( this.#list.length === 0 ) {

            this.dispose();
        }

        return this;
    }

    dispose() {

        this.#index = undefined;
        this.#list.clear();
        this.#list = null;
    
        this.#distanceCache = undefined;
        this.#cacheMainIndex = undefined;
    }

    #getDistance() {

        return BABYLON.Vector3.Distance( this.#containers.mainGrid, this.#grid );
    }

}