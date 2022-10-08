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
    #list = new SmartObjectArray( 100 );
    #isDisposed = false;

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

    /*get nodes() {

        return this.#list;
    }*/

    get distance() {

        this.#preventDisposed();

        if ( this.#distanceCache === undefined || this.#cacheMainIndex !== this.#containers.mainIndex ) {

            this.#distanceCache = this.#getDistance();
            this.#cacheMainIndex = this.#containers.mainIndex;
        }

        return this.#distanceCache;
    }

    store( node ) {

        this.#preventDisposed();
        
        this.#list.add( node );

        return this;
    }

    unstore( node, onDispose = undefined ) {

        this.#preventDisposed();

        this.#list.delete( node );

        if ( this.#list.size === 0 ) {

            onDispose?.( this.index );
            this.dispose();
        }

        return this;
    }

    onEnter( oldIndex ) {
        /*
        this.#preventDisposed();

        for ( let i = 0; i < this.#list.size; i++ ) {
        
            this.#containers.game.star.shadow.resume( this.#list[i] );
        }
        */
    }

    onLeave( newIndex ) {
        /*
        this.#preventDisposed();

        for ( let i = 0; i < this.#list.size; i++ ) {
        
            this.#containers.game.star.shadow.pause( this.#list[i] );
        }
        */
    }

    debug( parent = null ) {

        this.#preventDisposed();

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

        this.#isDisposed = true;
        this.#index = undefined;
        this.#list.clear();
        this.#list = null;
    
        this.#distanceCache = undefined;
        this.#cacheMainIndex = undefined;
    }

    #getDistance() {
        
        return BABYLON.Vector3.Distance( this.#containers.mainGrid, this.#grid ) * ObjectContainer.size;
    }

    #preventDisposed() {

        if ( this.#isDisposed === true ) {

            console.error( "ObjectContainer: Container is disposed!" );
        }
    }

}