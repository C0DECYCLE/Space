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
    #list = new ObjectArray();

    #distanceCache = undefined;
    #cacheMainIndex = undefined;

    constructor( containers, index ) {

        this.#containers = containers;
        this.#index = index;
    }

    get index() {

        return this.#index;
    }

    get nodes() {

        return this.#list;
    }

    get distance() {

        return 0;
    }

    store( node ) {

        this.#list.add( node );
    }

    unstore( node ) {

        this.#list.remove( node );
    }

}