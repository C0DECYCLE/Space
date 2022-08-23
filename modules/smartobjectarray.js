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

    /* override */ get( index ) {

        if ( index < this.len ) {

            return super.get( index );
        }
    }

    /* override */ delete( object ) {

        super.delete( object, this.len );
    }

    /* override */ pop() {

        if ( this.len > 0 ) {

            const object = this[ --this.len ];
            delete object[ this.uuid ];

            return object;
        }
    }

    /* override */ clear() {

        this.len = 0;
    }

    destroy() {

        this.clear();
        super.clear();
    }

}