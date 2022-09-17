"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainer {

    static size = 512;

    #containers = null;

    #index = undefined;
    #grid = null;
    #list = new ObjectArray();

    #distanceCache = undefined;
    #cacheMainIndex = undefined;
    #debugMesh = null;

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

    onEnter( oldIndex ) {

        
    }

    onLeave( newIndex ) {

        
    }

    debug( parent = null ) {

        if ( this.#debugMesh === null ) {

            const scene = this.#containers.game.scene;

            this.#debugMesh = BABYLON.MeshBuilder.CreateBox( `objectcontainer_${ this.index }`, { size: ObjectContainer.size }, scene );
            this.#debugMesh.material = scene.debugMaterialWhite;
            this.#debugMesh.position.copyFrom( ObjectContainerUtils.indexToApproximatePosition( this.index ) );

            if ( parent !== null ) {

                this.#debugMesh.parent = parent;
            }
        }
    }

    dispose() {

        this.#index = undefined;
        this.#list.clear();
        this.#list = null;
    
        this.#distanceCache = undefined;
        this.#cacheMainIndex = undefined;
    }

    #getDistance() {
        
        return BABYLON.Vector3.Distance( this.#containers.mainGrid, this.#grid ) * ObjectContainer.size;
    }

}