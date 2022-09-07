"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipPhysics extends PhysicsEntity {

    #spaceship = null;

    #localVelocity = new BABYLON.Vector3();

    /* override */ constructor( spaceship ) {

        super( spaceship.root, PhysicsEntity.TYPES.DYNAMIC );
        
        this.#spaceship = spaceship;
    }

    /* override */ update() {
        
        if ( this.#spaceship.hasController === true ) {

            this.#movement();
        }
        
        if ( this.#spaceship.nearPlanet !== null ) {

            const up = this.#spaceship.nearPlanet.physics.spin( this );
            //this.quaternionTowardsUpright( up, this.#spaceship.config.atmosphereup );
        }

        super.update();
    }

    #movement() {

        const controls = this.#spaceship.game.controls;
        const mainAcceleration = this.#spaceship.config.mainAcceleration;
        const brakeScale = 1 - this.#spaceship.config.brakeAcceleration;
        const minorAcceleration = this.#spaceship.config.minorAcceleration;
        const rollSpeed = this.#spaceship.config.rollSpeed;
        const deltaCorrection = this.#spaceship.game.engine.deltaCorrection;
        const acceleration = new BABYLON.Vector3( 0, 0, 0 );

        if ( controls.activeKeys.has( "w" ) === true ) {

            acceleration.z = mainAcceleration;

        } else if ( controls.activeKeys.has( "s" ) === true ) {

            this.#localVelocity.scaleInPlace( brakeScale );
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

        if ( controls.activeKeys.has( "q" ) === true ) {

            this.#spaceship.root.rotate( BABYLON.Axis.Z, rollSpeed * deltaCorrection, BABYLON.Space.LOCAL );

        } else if ( controls.activeKeys.has( "e" ) === true ) {

            this.#spaceship.root.rotate( BABYLON.Axis.Z, -rollSpeed * deltaCorrection, BABYLON.Space.LOCAL );
        }

        this.#movementTranslate( acceleration );
    }

    #movementTranslate( acceleration ) {
        
        const velocityLimit = this.#spaceship.config.velocityLimit;
        const velocityDrag = this.#spaceship.config.velocityDrag;
        
        if ( acceleration.x !== 0 || acceleration.y !== 0 || acceleration.z !== 0 ) {

            this.#localVelocity.addInPlace( acceleration );
        }
        
        if ( this.#localVelocity.length() > velocityLimit ) {
                
            this.#localVelocity.normalize().scaleInPlace( velocityLimit );
        }
        
        this.velocity.copyFrom( BABYLON.Vector3.Lerp( this.velocity, this.#localVelocity.applyRotationQuaternion( this.#spaceship.rotationQuaternion ), velocityDrag ) );
        
        if ( this.velocity.length() < 0.001 ) {

            this.velocity.copyFromFloats( 0, 0, 0 );
        }
    }
    
}