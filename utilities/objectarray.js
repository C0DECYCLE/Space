"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectArray extends Array {

    uuid = UUIDv4(); constructor(debug){super();this.debug=debug;}

    /* override */ push( object ) {
            
        if ( object.oaMeta === undefined ) {

            object.oaMeta = new Map();  
        }
        
        object.oaMeta.set( this.uuid, this.length );

        super.push( object );if(object.oaMeta.get( this.uuid )!==super.indexOf(object)&& this.debug )console.error("index",object.oaMeta.get( this.uuid ),"was set with push (real index is",super.indexOf(object),")!");
    }

    /* override */ indexOf( object ) {
        
        if ( object.oaMeta === undefined ) {

            return -1;

        } else {
            
            const index = object.oaMeta.get( this.uuid );

            if ( index > this.length && this.debug ) {

                console.error("index",index,"of",object,"was out of bounds, real index is",super.indexOf(object),"!"); 
            }
            if(index !== undefined && index!==super.indexOf(object)&& this.debug )console.error("my index",index,"is wrong (real index is",super.indexOf(object),")!");
            return index === undefined ? -1 : index;
        }
    }

    /* override */ includes( object ) {

        return object.oaMeta === undefined ? false : object.oaMeta.has( this.uuid );
    }

    /* override */ pop() {

        const object = super.pop();
        object.oaMeta.delete( this.uuid );

        return object;
    }

    add( object ) {

        if ( this.has( object ) === false ) {

            this.push( object );
        }
    }

    has( object ) {

        return this.includes( object );
    }

    get( index ) {

        return this[ index ];
    }

    match( property, value ) {

        let i;

        for ( i = 0; i < this.length; i++ ) {

            if ( this[i][ property ] === value ) {
                
                return this[i];
            }
        }
    }

    delete( object ) {

        if ( this.has( object ) === true ) {
            
            if ( object !== this[ this.length - 1 ] ) {
                
                const index = this.indexOf( object );if(index===-1&& this.debug )console.error("delete, index -1!");
                const lastObject = this[ this.length - 1 ];

                lastObject.oaMeta.set( this.uuid, index );
                this[ index ] = lastObject;
                this[ this.length - 1 ] = object;
            }

            this.pop();
            this.splice( this.length, 0 ); //for babylon rtt hook
        }
    }

    /* override */ clear() {

        let i;

        for ( i = 0; i < this.length; i++ ) {

            this[i].oaMeta.delete( this.uuid );
        }

        super.clear();
    }
    
    /* override */ shift() {
        console.warn("ObjectArray: Illegal operation, shift.");
    }
    
    /* override */ sort() {
        console.warn("ObjectArray: Illegal operation, sort.");
    }
    
    /* override */ splice() {
        //console.warn("ObjectArray: Illegal operation, splice.");
    }
    
    /* override */ unshift() {
        console.warn("ObjectArray: Illegal operation, unshift.");
    }

}