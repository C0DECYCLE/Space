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

    #root = null;
    #create = undefined;

    constructor( original, create, size, increase ) {
        
        this.#increase = increase;
        this.#create = create;

        this.#setupObjectArrays( size );
        this.#createRoot( original );
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

    #createRoot( original ) {

        this.#root = new BABYLON.TransformNode( `entitymanager_${ original.name }`, entity.getScene() );
        this.#root.setEnabled( false );
    }

    #make( amount ) {

        for ( let i = 0; i < amount; i++ ) {

            this.#store( this.#create() );
        }
    }

    #release( entity ) {

        entity.setEnabled( true );
        entity.parent = null;

        this.#used.add( entity );

        return entity;
    }

    #store( entity ) {

        entity.setEnabled( false );
        entity.parent = this.#root;

        this.#free.add( entity );
    }
    
}