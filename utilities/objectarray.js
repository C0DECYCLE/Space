"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectArray extends Array {

    uuid = UUIDv4();

    /* override */ push( object ) {

        if ( object.oaMeta === undefined ) {

            object.oaMeta = new Map();  
        }
        
        object.oaMeta.set( this.uuid, this.length );

        super.push( object );
    }

    /* override */ indexOf( object ) {
        
        return object.oaMeta === undefined ? -1 : object.oaMeta.get( this.uuid ) || -1;
    }

    /* override */ contains( object ) {

        return object.oaMeta === undefined ? false : object.oaMeta.has( this.uuid );
    }

    /* override */ pop() {

        const object = super.pop();
        object.oaMeta.delete( this.uuid );

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

            this[ len - 1 ].oaMeta.set( this.uuid, this.indexOf( object ) );
            this[ this.indexOf( object ) ] = this[ len - 1 ];
            this[ len - 1 ] = object;

            this.pop();
            this.splice( len, 0 ); //for babylon rtt hook
        }
    }

    clear() {

        this.length = 0;
    }

}