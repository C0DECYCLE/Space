"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainersSpatialHash {

    list = new Map();

    #containers = null;

    constructor( containers ) {

        this.#containers = containers;
    }

    add( node ) {

        //get all objectcontainers based on min max index by boundaries (min max position);
        //all objetcontainers store node
        //node.objectcontainer = container; //main get by position index
        //if node.objectcontainers === undefined then
        //node.objectcontainers = [];
        //else
        //node.objectcontainers.length = 0;
        //
        //node.objectcontainers.push all based on boundaries
    }

    get( index ) {

        return this.list.get( index );
    }

    remove( node ) {

        //go thr all node.objectcontainers and unstore node
        //node.objectcontainer = null;
        //node.objectcontainers.length = 0;
    }

    #getOrMake( index ) {

        let container = this.list.get( index );

        if ( container === undefined ) {

            container = new ObjectContainer( this.#containers, index );

            this.list.set( index, container );
        }

        return container;
    }

}