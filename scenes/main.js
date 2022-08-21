"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

Space.addOnReady( () => {

    window.manager = new Manager( {} );
    
    Space.engine.set( ( delta ) => {
        
        Space.engine.stats[3].begin();
        window.manager.update( delta );
        Space.engine.stats[3].end();

        window.manager.render();
    } );

} );
