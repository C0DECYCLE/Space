"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SmartObjectArray extends ObjectArray {

    len = 0;

    //////////////////////////
    constructor() { console.error( "SmartObjectArray is out of date! refactor from ObjectArray!" ); }
    //////////////////////////

    /* override */ push( object ) {
        
        object[ this.uuid ] = this.len;
        this[ this.len++ ] = object;

        if ( this.len >= this.length ) {

            this.length *= 2;
        }
    }

    /* override */ pop() {

        if ( this.len > 0 ) {

            const object = this[ --this.len ];
            this[ this.len ] = undefined;
            delete object[ this.uuid ];

            return object;
        }
    }

    /* override */ get( index ) {

        if ( index < this.len ) {

            return super.get( index );
        }
    }

    /* override */ match( property, value ) {

        super.match( property, value, this.len );
    }

    /* override */ delete( object ) {

        super.delete( object, this.len );
    }

}