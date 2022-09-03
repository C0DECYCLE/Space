"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipPhysics extends PhysicsEntity {

    #spaceship = null;

    //#localVelocity = new BABYLON.Vector3();

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
        const mainAcceleration = this.#spaceship.config.mainAcceleration;
        const minorAcceleration = this.#spaceship.config.minorAcceleration;
        const deltaCorrection = this.#spaceship.game.engine.deltaCorrection;
        const acceleration = new BABYLON.Vector3( 0, 0, 0 );

        if ( controls.activeKeys.has( "w" ) === true ) {

            acceleration.z = mainAcceleration;

        } else if ( controls.activeKeys.has( "s" ) === true ) {

            acceleration.z = -minorAcceleration;
        }
        
        if ( controls.activeKeys.has( "d" ) === true ) {

            acceleration.x = minorAcceleration;

        } else if ( controls.activeKeys.has( "a" ) === true ) {

            acceleration.x = -minorAcceleration;
        }
        
        if ( controls.activeKeys.has( "x" ) === true ) {

            acceleration.y = minorAcceleration;

        } else if ( controls.activeKeys.has( "y" ) === true ) {

            acceleration.y = -minorAcceleration;
        }

        this.#movementTranslate( acceleration );

        if ( controls.activeKeys.has( "q" ) === true ) {

            this.#spaceship.root.rotate( BABYLON.Axis.Z, 0.05 * deltaCorrection, BABYLON.Space.LOCAL );

        } else if ( controls.activeKeys.has( "e" ) === true ) {

            this.#spaceship.root.rotate( BABYLON.Axis.Z, -0.05 * deltaCorrection, BABYLON.Space.LOCAL );
        }
    }

    #movementTranslate( acceleration ) {
        
        /*
        if ( acceleration.x !== 0 || acceleration.y !== 0 || acceleration.z !== 0 ) {

            const velocityLimit = this.#spaceship.config.velocityLimit;
            const testVelocity = this.#localVelocity.scaleInPlace( 0.8 ).add( acceleration.applyRotationQuaternionInPlace( this.#spaceship.rotationQuaternion ) );

            if ( testVelocity.length() <= velocityLimit ) {
                
                testVelocity.normalize().scaleInPlace( velocityLimit );
            }

            this.#localVelocity.copyFrom( testVelocity );   

        } else {

            this.#localVelocity.applyRotationQuaternionInPlace( this.#spaceship.rotationQuaternion );
        }

        this.velocity.copyFrom( this.#localVelocity );
        */
    }
    
}