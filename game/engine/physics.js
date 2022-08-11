"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Physics {

    config = {

        fixedTimeStep: undefined, //1.0 / 60.0
        maxSubSteps: 3
    };

    world = new CANNON.World();

    constructor( config ) {

        this.config.fixedTimeStep = 1.0 / config.fixedFps;

        this.world.gravity.set( 0, 0, 0 );
    }

    update( delta ) {

        //this.world.step( this.config.fixedTimeStep, delta / 1000, this.config.maxSubSteps );
        this.world.step( delta / 1000 );
    }

}