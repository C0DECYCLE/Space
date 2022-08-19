"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerPhysics extends PhysicsEntity {

    #player = null;
    #planet = null;

    constructor( player ) {

        super( player.root, PhysicsEntity.TYPES.DYNAMIC );
        
        this.#player = player;
    }

    setPlanet( value ) {

        this.#planet = value;
    }

    space() {

        this.#spaceMovement();
    }

    planet() {

        if ( this.#planet != null ) {
            
            const up = this.#planet.physics.pull( this );

            if ( this.state == PhysicsEntity.STATES.GROUND ) {

                this.#planetMovement();
                this.quaternionTowardsUpright( up, 1.0 );
            }
            
        } else {

            console.error( "Planet Gravity: Planet is null!" );
        }
    }

    #spaceMovement() {

        const controls = this.#player.controls;
        const deltaCorrection = Space.engine.deltaCorrection;
        const speed = this.#player.config.speed * deltaCorrection;
        const translate = new BABYLON.Vector3( 0, 0, 0 );

        if ( controls.activeKeys.has( "w" ) == true ) {

            translate.z = speed;

        } else if ( controls.activeKeys.has( "s" ) == true ) {

            translate.z = -speed;
        }
        
        if ( controls.activeKeys.has( "d" ) == true ) {

            translate.x = speed;

        } else if ( controls.activeKeys.has( "a" ) == true ) {

            translate.x = -speed;
        }
        
        if ( controls.activeKeys.has( "q" ) == true ) {

            translate.y = speed;

        } else if ( controls.activeKeys.has( "e" ) == true ) {

            translate.y = -speed;
        }

        this.#movementTranslate( translate );
    }

    #planetMovement() {

        const controls = this.#player.controls;
        const deltaCorrection = Space.engine.deltaCorrection;
        const speed = this.#player.config.speed * deltaCorrection;
        const translate = new BABYLON.Vector3( 0, 0, 0 );

        if ( controls.activeKeys.has( "w" ) == true ) {

            translate.z = speed;

        } else if ( controls.activeKeys.has( "s" ) == true ) {

            translate.z = -speed;
        }
        
        if ( controls.activeKeys.has( "d" ) == true ) {

            translate.x = speed;

        } else if ( controls.activeKeys.has( "a" ) == true ) {

            translate.x = -speed;
        }

        this.#movementTranslate( translate );
    }

    #movementTranslate( translate ) {
        
        if ( translate.x != 0 || translate.y != 0 || translate.z != 0 ) {

            this.delta.addInPlace( translate.applyRotationQuaternion( this.#player.rotationQuaternion ) );   
        }
    }
    
}