"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/


window.log = console.log;


function UUIDv4() {

    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
};


Array.prototype.hasByProperty = function( property, value ) {
    
    let i;
    const len = this.length;

    for ( i = 0; i < len; i++ ) {
        
        if ( this[i][property] === value ) {
            
            return true;
        }
    }
    
    return false;
};


Array.prototype.getByProperty = function( property, value ) {
    
    let i;
    const len = this.length;

    for ( i = 0; i < len; i++ ) {
        
        if ( this[i][property] === value ) {
            
            return this[i];
        }
    }
    
    return null;
};


Array.prototype.removeByProperty = function( property, value ) {
    
    let index = -1;
    let i;
    const len = this.length;
    
    for ( i = 0; i < len; i++ ) {
        
        if ( this[i][property] === value ) {

            index = i;
        }
    }
    
    if ( index !== -1 ) {
        
        this.splice( index, 1 );
    }

    return this;
};


Array.prototype.remove = function( value ) {
    
    const index = this.indexOf( value );
    
    if ( index !== -1 ) {
        
        this.splice( index, 1 );
    }

    return this;
};


Array.prototype.quick_remove = function( index ) {

    const len = this.length;
    const last_value = this[ len - 1 ];

    this[ len - 1 ] = this[ index ];
    this[ index ] = last_value;

    this.pop();

    return this;
};


Number.prototype.between = function( a, b ) {

    return this > Math.min( a, b ) && this < Math.max( a, b );
};


String.prototype.firstLetterUppercase = function() {

    return this.charAt( 0 ).toUpperCase() + this.slice( 1 );
};


Number.prototype.dotit = function() {

    return Math.round( this ).toString().replace( /(\d)(?=(\d{3})+(?!\d))/g, "$1." );
};


Number.prototype.clamp = function( min, max ) {

    return Math.min( Math.max( this, min ), max );
};