"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SmartObjectArray extends ObjectArray {

    len = 0;

    /* override */ pop() {

        if ( this.len > 0 ) {

            const object = this[ --this.len ];
            delete object[ this.uuid ];
            this[ this.len ] = undefined;

            return object;
        }
    }
    
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

    /* override */ match( property, value ) {

        super.match( property, value, this.len );
    }

    /* override */ delete( object ) {

        super.delete( object, this.len );
    }

}