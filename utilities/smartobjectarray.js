"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SmartObjectArray extends ObjectArray {

    size = 0;

    /* override */ constructor( capacity = 1 ) {
    
        super( capacity );
    }

    /* override */ push( object ) {
            
        this[ this.size++ ] = this.initialize( object, this.size );

        if ( this.size >= this.length ) {

            this.length *= 2;
        }
    }

    /* override */ pop() {
        log("smartobjectarray pop");
        if ( this.size > 0 ) {

            const object = this[ --this.size ];
            this.decommission( object );
            this.#clean( this.size );

            return object;
        }
    }

    /* override */ clear() {

        let i;

        for ( i = 0; i < this.length; i++ ) {

            this.decommission( this[i] );
            this.#clean( i );
        }

        this.size = 0;
    }

    /* override */ delete( object ) {
        log("smartobjectarray delete");
        super.delete( object, this.size );
    }

    #clean( index ) {

        this[ index ] = undefined;
    }

}