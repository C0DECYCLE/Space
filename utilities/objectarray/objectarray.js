"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectArray extends Array {

    uuid = UUIDv4();

    /* override */ push( object ) {
            
        super.push( this.initialize( object ) );
    }

    /* override */ includes( object ) {

        return object.metalist === undefined ? false : object.metalist.has( this.uuid );
    }

    /* override */ indexOf( object ) {
        
        if ( object.metalist === undefined ) {

            return -1;
        }
        
        const index = object.metalist.get( this.uuid );

        if ( index > this.length ) {
            
            console.error( `ObjectArray: index ${ index } was out of bounds, real index is ${ super.indexOf( object ) }.` ); 
        }

        return index === undefined ? -1 : index;
    }

    /* override */ pop() {

        return this.decommission( super.pop() );
    }
    
    /* override */ splice( prevent = false ) {
        
        if ( prevent !== true ) {
            
            console.warn( "ObjectArray: Illegal splice operation." );
        }
    }

    /* override */ shift() {

        console.warn( "ObjectArray: Illegal shift operation." );
    }
    
    /* override */ sort() {

        console.warn( "ObjectArray: Illegal sort operation." );
    }
    
    /* override */ unshift() {

        console.warn( "ObjectArray: Illegal unshift operation." );
    }

    /* override */ clear() {

        let i;

        for ( i = 0; i < this.length; i++ ) {

            this.decommission( this[i] );
        }

        super.clear();
    }
    
    add( object ) {

        if ( this.has( object ) === false ) {

            this.push( object );
        }
    }

    has( object ) {

        return this.includes( object );
    }

    delete( object, length = this.length ) {

        if ( this.has( object ) === false ) {

            return;
        }

        this.#interchange( object, length );
        this.pop();
        this.splice( true ); //for babylon rtt hook
    }

    initialize( object, length = this.length ) {

        if ( object.metalist === undefined ) {

            object.metalist = new Map();  
        }
        
        object.metalist.set( this.uuid, length );

        return object;
    }

    decommission( object ) {

        object.metalist.delete( this.uuid );

        return object;
    }

    #interchange( object, length = this.length ) {

        const lastObject = this[ length - 1 ];
           
        if ( object !== lastObject ) {
            
            const index = this.indexOf( object );

            if ( index === -1 ) {
                
                console.error( "ObjectArray: Try to delete index of -1." );
            }

            this[ index ] = lastObject;
            lastObject.metalist.set( this.uuid, index );
            this[ length - 1 ] = object;
        }
    }

}