"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipVulcan extends Spaceship {

    static name = "Vulcan";

    static interactables = [ "glass" ];

    /* override */ config = {

        seat: new BABYLON.Vector3( 0, 0.75, 10.5 ),

        thrusters: [

            new BABYLON.Vector3( -2, 0, -10.25 ),
            new BABYLON.Vector3( 2, 0, -10.25 )
        ],

        mainAcceleration: 0.01,
        brakeAcceleration: 0.25,
        minorAcceleration: 0.0025,
        rollSpeed: 0.025,

        velocityLimit: 1.0,
        velocityDrag: 0.005
    };

    /* override */ constructor( game, config ) {

        super( game, config );
        
        EngineUtils.configure.call( this, config );

        this.post();
    }

}