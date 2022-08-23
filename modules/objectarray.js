"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectArray extends Array {

    uuid = UUIDv4();

    add( object ) {

        if ( object[ this.uuid ] === undefined ) {

            object[ this.uuid ] = this.length;

            this.push( object );
        }
    }

    delete( object, len = this.length ) {

        if ( object[ this.uuid ] !== undefined ) {

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

}