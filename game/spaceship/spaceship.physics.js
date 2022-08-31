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
        
        this.#movement();

        super.update();
    }

    #movement() {

    }
    
}