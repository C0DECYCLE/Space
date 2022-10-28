"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipPhysicsTravel {

    static get VELOCITY() {

        return 128; 
    }

    #spaceshipPhysics = null;
    #game = null;

    #pressedThreshold = 500;
    #pointingThreshold = 0.1;

    #pressedTime = 0;
    #isTraveling = false;
    #jumping = false;

    constructor( spaceshipPhysics ) {

        this.#spaceshipPhysics = spaceshipPhysics;
        this.#game = this.#spaceshipPhysics.spaceship.game;
    }

    get isTraveling() {

        return this.#isTraveling;
    }

    get isJumping() {

        return this.#jumping === false ? false : true;
    }

    update() {
        
        if ( this.#spaceshipPhysics.spaceship.hasController === false ) {
        
            return;
        }

        if ( this.isJumping === false ) {

            this.#evaluate();

        } else {

            this.#updateJumping();
        }
    }

    #evaluate() {

        const potential = this.#getPotentialMarker();

        if ( potential !== null ) {

            potential.lightUp = true;
        }
        
        if ( this.#evaluateKeyPress() === true ) {

            this.#onKeyPress( potential );
        }
    }

    #getPotentialMarker() {

        const markers = this.#game.ui.markers.get( "travel" );
        const direction = this.#spaceshipPhysics.spaceship.root.forward;
        
        for ( let i = 0; i < markers.length; i++ ) {

            markers[i].lightUp = false;

            if ( markers[i].isNear === false && Math.acos( BABYLON.Vector3.Dot( direction, markers[i].direction ) ) < this.#pointingThreshold ) {

                return markers[i];   
            }
        }

        return null;
    }

    #evaluateKeyPress() {

        if ( this.#spaceshipPhysics.controls.activeKeys.has( Controls.KEYS.Travel ) === true && Date.now() - this.#pressedTime > this.#pressedThreshold ) {

            this.#pressedTime = Date.now();

            return true;
        }

        return false;
    }

    #onKeyPress( potential ) {

        if ( this.#isTraveling === false ) {

            this.#isTraveling = true;

        } else {

            if ( potential !== null ) {

                this.#startJumping( potential );

            } else {

                this.#isTraveling = false;
            }
        }
    }

    #startJumping( potential ) {

        this.#jumping = potential;
        EngineUtils.setTransformNodeDirection( this.#spaceshipPhysics.spaceship.root, this.#jumping.direction );   
        //this.#spaceshipPhysics.pause( false, true );
    }
    
    #updateJumping() {

        const size = EngineUtils.getBoundingSize( this.#jumping.node );
        
        if ( this.#jumping.distance > size / 2 && this.#evaluateKeyPress() === false ) {

            this.#spaceshipPhysics.velocity.copyFrom( this.#jumping.direction ).scaleInPlace( SpaceshipPhysicsTravel.VELOCITY * this.#game.engine.deltaCorrection );

        } else {

            this.#stopJumping();
        }
    }

    #stopJumping() {

        this.#spaceshipPhysics.velocity.copyFromFloats( 0, 0, 0 );
        //this.#spaceshipPhysics.resume();
        this.#jumping = false;
    }

}