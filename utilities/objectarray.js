"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectArray extends Array {

    uuid = UUIDv4();

    /* override */ push( object ) {

        object[ this.uuid ] = this.length;
        super.push( object );
    }

    /* override */ indexOf( object ) {

        return object[ this.uuid ];
    }

    /* override */ contains( object ) {

        return object[ this.uuid ] !== undefined;
    }

    /* override */ pop() {

        const object = super.pop();
        delete object[ this.uuid ];

        return object;
    }

    add( object ) {

        if ( this.contains( object ) === false ) {

            this.push( object );
        }
    }

    has( object ) {

        return this.contains( object );
    }

    get( index ) {

        return this[ index ];
    }

    match( property, value, len = this.length ) {

        let i;

        for ( i = 0; i < len; i++ ) {

            if ( this[i][ property ] === value ) {
                
                return this[i];
            }
        }
    }

    delete( object, len = this.length ) {

        if ( this.contains( object ) === true ) {

            this[ len - 1 ][ this.uuid ] = object[ this.uuid ];
            this[ object[ this.uuid ] ] = this[ len - 1 ];

            this.pop();
        }
    }

    clear() {

        this.length = 0;
    }

}