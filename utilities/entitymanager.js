"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EntityManager {

    #free = null;
    #used = null;
    #increase = undefined;

    #onStore = undefined;
    #onRelease = undefined;

    #scene = null;
    #root = null;
    #create = undefined;

    constructor( name, scene, create, size, increase, onStore = this.#onStore, onRelease = this.#onRelease ) {
        
        this.#increase = increase;
        this.#onStore = onStore;
        this.#onRelease = onRelease;

        this.#scene = scene;
        this.#create = create;

        this.#setupObjectArrays( size );
        this.#createRoot( name );
        this.#make( size );
    }

    request() {

        if ( this.#free.size === 0 ) {

            this.#make( this.#increase );
        }

        return this.#release( this.#free.pop() );
    }

    return( entity ) {

        this.#used.delete( entity );
        this.#store( entity );
    }

    #setupObjectArrays( capacity ) {

        this.#free = new SmartObjectArray( capacity );
        this.#used = new SmartObjectArray( capacity );
    }

    #createRoot( name ) {

        //just node?
        this.#root = new BABYLON.TransformNode( `entitymanager_${ name }`, this.#scene );
        this.#root.setEnabled( false );
    }

    #make( amount ) {

        for ( let i = 0; i < amount; i++ ) {

            this.#store( this.#create() );
        }
    }

    #release( entity ) {

        this.#used.add( entity );
        
        this.#onRelease?.( entity );
        
        entity.parent = null;
        entity.setEnabled( true );

        return entity;
    }

    #store( entity ) {

        entity.setEnabled( false );
        entity.parent = this.#root;

        this.#onStore?.( entity );
        
        this.#free.add( entity );
    }
    
}