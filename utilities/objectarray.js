"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectArray extends Array {

    uuid = UUIDv4();

    /* override */ push( object ) {
            
        if ( object.metalist === undefined ) {

            object.metalist = new Map();  
        }
        
        object.metalist.set( this.uuid, this.length );
        super.push( object );
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

        const object = super.pop();
        object.metalist.delete( this.uuid );

        return object;
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

            this[i].metalist.delete( this.uuid );
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

    delete( object ) {

        if ( this.has( object ) === false ) {

            return;
        }

        this.#interchange( object );
        this.pop();
        this.splice( true ); //for babylon rtt hook
    }

    #interchange( object ) {

        const lastObject = this[ this.length - 1 ];
           
        if ( object !== lastObject ) {
            
            const index = this.indexOf( object );

            if ( index === -1 ) {
                
                console.error( "ObjectArray: Try to delete index of -1." );
            }

            this[ index ] = lastObject;
            lastObject.metalist.set( this.uuid, index );
            this[ this.length - 1 ] = object;
        }
    }

}