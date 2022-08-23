"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectArray extends Array {

    uuid = UUIDv4();

    /* override */ indexOf( object ) {

        return object[ this.uuid ];
    }

    /* override */ contains( object ) {

        return object[ this.uuid ] !== undefined;
    }

    add( object ) {

        if ( this.contains( object ) === false ) {

            object[ this.uuid ] = this.length;
            this.push( object );
        }
    }

    has( object ) {

        return this.contains( object );
    }

    get( index ) {

        return this[ index ];
    }

    delete( object, len = this.length ) {

        if ( this.contains( object ) === true ) {

            const uuid = this.uuid;
            const last_value = this[ len - 1 ];
            const index = object[ uuid ];

            last_value[ uuid ] = index;

            this[ len - 1 ] = this[ index ];
            this[ index ] = last_value;

            this.pop();
            delete object[ uuid ];
        }
    }

    clear() {

        this.length = 0;
    }

}