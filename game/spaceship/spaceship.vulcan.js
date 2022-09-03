"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipVulcan extends Spaceship {

    static name = "Vulcan";

    /* override */ config = {

        seat: new BABYLON.Vector3( 0, 1.5, -1.2 ),

        mainAcceleration: 0.02,
        minorAcceleration: 0.01,

        velocityLimit: 2
    };

    /* override */ constructor( game, config ) {

        super( game, config );
        
        EngineUtils.configure.call( this, config );
    }

}