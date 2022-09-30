"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SmartObjectArray extends ObjectArray {

    static default = 0;

    size = 0;

    /* override */ constructor( capacity ) {
    
        super( capacity );
        this.#fill();
    }

    /* override */ push( object ) {
            
        this[ this.size ] = this.initialize( object, this.size++ );

        if ( this.size === this.length ) {

            this.length *= 2;
            this.#fill( this.size );
        }
    }

    /* override */ pop() {
        
        if ( this.size > 0 ) {

            const object = this[ --this.size ];
            this.decommission( object );
            this.#clean( this.size );

            return object;
        }
    }

    /* override */ clear() {

        let i;

        for ( i = 0; i < this.size; i++ ) {

            this.decommission( this[i] );
            this.#clean( i );
        }

        this.size = 0;
    }

    /* override */ delete( object ) {
        
        super.delete( object, this.size );
    }

    #fill( start = 0, end = this.length ) {

        let i;

        for ( i = start; i < end; i++ ) {

            this.#clean(i);
        }
    }

    #clean( index ) {

        this[ index ] = SmartObjectArray.default;
    }

}