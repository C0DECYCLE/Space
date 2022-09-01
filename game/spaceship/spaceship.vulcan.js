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

        mainAcceleration: 0.2,
        mainVelocityLimit: 5,
        
        minorAcceleration: 0.05,
        minorVelocityLimit: 0.5
    };

    /* override */ constructor( game, config ) {

        super( game, config );
        
        EngineUtils.configure.call( this, config );
    }

}