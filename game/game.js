"use strict";

class Game {
    
    /*
        Palto Studio
        Developed by Noah Bussinger
        2022
    */

    engine = null;

    constructor() {

        const ready = new Event( "ready" );

        window.addEventListener( "load", ( event ) => {

            console.log( `\n\n${ document.title }\n\nPalto Studio\nCopyright Noah Bussinger ${ new Date().getUTCFullYear() }\n\n` );

            this.engine = new Engine();

            window.dispatchEvent( ready );
        } );
    }
    
    addOnReady( callback = undefined ) {

        window.addEventListener( "ready", () => callback?.call( this ) );
    }

    add( key, callback = undefined ) {

        this[ key ] = () => callback?.call( this );
    }

    update( scene, update = undefined ) {

        this.engine.set( delta => {
        
            this.engine.stats[3].begin();

            update?.( delta );

            this.engine.stats[3].end();
    
            scene.render();
        } );
    }
}