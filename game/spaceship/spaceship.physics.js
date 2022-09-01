"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipPhysics extends PhysicsEntity {

    #spaceship = null;

    /* override */ constructor( spaceship ) {

        super( spaceship.root, PhysicsEntity.TYPES.DYNAMIC );
        
        this.#spaceship = spaceship;
    }

    /* override */ update() {
        
        if ( this.#spaceship.hasController === true ) {

            this.#movement();
        }

        super.update();
    }

    #movement() {

        const controls = this.#spaceship.game.controls;
        const deltaCorrection = this.#spaceship.game.engine.deltaCorrection;

        //increase velocity forward backward with w s until max big for forward and until max little for s
        //increase velocity left right up down with a d x y unitl max little

        if ( controls.activeKeys.has( "q" ) === true ) {

            this.#spaceship.root.rotate( BABYLON.Axis.Z, 0.05 * deltaCorrection, BABYLON.Space.LOCAL );

        } else if ( controls.activeKeys.has( "e" ) === true ) {

            this.#spaceship.root.rotate( BABYLON.Axis.Z, -0.05 * deltaCorrection, BABYLON.Space.LOCAL );
        }
    }
    
}