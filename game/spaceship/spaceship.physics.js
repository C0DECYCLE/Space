"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipPhysics extends PhysicsEntity {

    static LANDING_ANGLE = 45 * EngineUtils.toRadian;

    spaceship = null;
    controls = null;
    travel = null;

    #localVelocity = new BABYLON.Vector3();

    /* override */ constructor( spaceship ) {

        super( spaceship.game, spaceship.root );
        
        this.spaceship = spaceship;
        this.controls = this.spaceship.game.controls;

        this.#setupTravel();
    }

    /* override */ update() {
        
        this.preUpdate();

        if ( this.travel.isJumping === false ) {

            if ( this.spaceship.hasController === true ) {

                this.#movement();
            }
            
            if ( this.spaceship.nearPlanet !== null ) {

                const up = this.spaceship.nearPlanet.physics.spin( this );
                
                this.#landingLogic( up );
            }
        }
        
        this.travel.update();
        this.postUpdate();
    }

    #setupTravel() {

        this.travel = new SpaceshipPhysicsTravel( this );
    }

    #movement() {

        const deltaCorrection = this.spaceship.game.engine.deltaCorrection;
        const mainAcceleration = this.spaceship.config.mainAcceleration * deltaCorrection;
        const brakeScale = ( 1 - this.spaceship.config.brakeAcceleration ) * deltaCorrection;
        const minorAcceleration = this.spaceship.config.minorAcceleration * deltaCorrection;
        const rollSpeed = this.spaceship.config.rollSpeed * deltaCorrection;
        const acceleration = new BABYLON.Vector3( 0, 0, 0 );

        if ( this.controls.activeKeys.has( Controls.KEYS.for ) === true ) {

            acceleration.z = mainAcceleration;

        } else if ( this.controls.activeKeys.has( Controls.KEYS.back ) === true ) {

            this.#localVelocity.scaleInPlace( brakeScale );
            
            if ( this.velocity.length() < 0.05 ) {
                
                this.#localVelocity.copyFromFloats( 0, 0, 0 );
                this.velocity.copyFromFloats( 0, 0, 0 );
            }
        }
        
        if ( this.controls.activeKeys.has( Controls.KEYS.right ) === true ) {

            acceleration.x = minorAcceleration;

        } else if ( this.controls.activeKeys.has( Controls.KEYS.left ) === true ) {

            acceleration.x = -minorAcceleration;
        }
        
        if ( this.controls.activeKeys.has( Controls.KEYS.up ) === true ) {

            acceleration.y = minorAcceleration;

        } else if ( this.controls.activeKeys.has( Controls.KEYS.down ) === true ) {

            acceleration.y = -minorAcceleration;
        }

        if ( this.controls.activeKeys.has( Controls.KEYS.leftRoll ) === true ) {

            this.spaceship.root.rotate( BABYLON.Axis.Z, rollSpeed, BABYLON.Space.LOCAL );

        } else if ( this.controls.activeKeys.has( Controls.KEYS.rightRoll ) === true ) {

            this.spaceship.root.rotate( BABYLON.Axis.Z, -rollSpeed, BABYLON.Space.LOCAL );
        }

        this.#movementTranslate( acceleration );
    }

    #movementTranslate( acceleration ) {
        
        const velocityLimit = this.spaceship.config.velocityLimit;
        const velocityDrag = this.spaceship.config.velocityDrag;
        
        if ( acceleration.x !== 0 || acceleration.y !== 0 || acceleration.z !== 0 ) {

            this.#localVelocity.addInPlace( acceleration );
        }
        
        if ( this.#localVelocity.length() > velocityLimit ) {
                
            this.#localVelocity.normalize().scaleInPlace( velocityLimit );
        }
        
        this.velocity.copyFrom( BABYLON.Vector3.Lerp( this.velocity, this.#localVelocity.applyRotationQuaternion( this.spaceship.rotationQuaternion ), velocityDrag ) );
    }

    #landingLogic( up ) {

        const distanceAboveGround = this.spaceship.nearPlanet.physics.getDistanceAboveGround( this, up ).clamp( 0, Infinity );
        const colliderMax = this.getColliderMax();
        
        if ( distanceAboveGround - colliderMax < 0 ) {

            const targetSize = this.getColliderMin() / PhysicsEntity.COLLIDER_SCALE;
            const lerp = 1 - ( ( distanceAboveGround - targetSize ) / ( colliderMax - targetSize ) );

            this.setColliderSize( BABYLON.Vector3.Lerp( this.getColliderSize(), BABYLON.Vector3.One().scaleInPlace( targetSize ), lerp.clamp( 0, 1 ) ) );
        }
    }
    
}