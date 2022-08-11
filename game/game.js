"use strict";

class Game {
    
    /*
        Palto Studio
        Developed by Noah Bussinger
        2022
    */

    engine = null;

    #ready = new Event( "ready" );

    constructor() {

        window.addEventListener( "load", ( event ) => {
            
            this.#greet();

            this.engine = new Engine();

            window.dispatchEvent( this.#ready );
        } );
    }

    #greet() {
        
        let name = document.title;
        let year = new Date().getUTCFullYear();

        console.log( `\n\n${ name }\n\nPalto Studio\nCopyright Noah Bussinger ${ year }\n\n` );
    }
    
    addOnReady( callback ) {

        if ( typeof callback == "function" ) {

            window.addEventListener( "ready", callback );
        }
    }

}