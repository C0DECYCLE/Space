"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SmartObjectArray extends ObjectArray {

    len = 0;

    /* override */ add( object ) {

        if ( object[ this.uuid ] === undefined ) {
                
            object[ this.uuid ] = this.len;

            this[ this.len++ ] = object;

            if ( this.len >= this.length ) {

                this.length *= 2;
            }
        }
    }

    /* override */ delete( object ) {

        super.delete( object, this.len );
    }

    /* override */ indexOf( object ) {

        const index = super.indexOf( object );

        if ( index >= this.len ) {

            return -1;
        }

        return index;
    }

    /* override */ contains( object ) {

        return this.indexOf( object ) !== -1;
    }

    /* override */ pop() {

        if ( this.len > 0 ) {

            const object = this[ --this.len ];

            delete object[ this.uuid ];

            return object;
        }
    }

    get( index ) {

        if ( index < this.len ) {

            return this[ index ];
        }
    }

    reset() {

        this.len = 0;
    }

    destroy() {

        this.reset();

        this.length = 0;
    }

}