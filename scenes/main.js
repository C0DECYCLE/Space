"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

Space.addOnReady( () => {

    window.manager = new Manager( {} );

    Space.engine.set( ( delta ) => window.manager.update( delta ) );

} );
