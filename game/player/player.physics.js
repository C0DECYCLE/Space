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

        super( player );
        
        this.#player = player;

        this.#addPhysics();
    }

    setPlanet( value ) {

        this.#planet = value;
    }

    space() {

        this.#spaceMovement();
    }

    planet() {

        if ( this.#planet != null ) {
            
            this.#planet.physics.pullPhysicsEntity( this.#player, true );
            this.#planet.physics.collideHeightmap( this.#player );

            if ( this.state != PhysicsEntity.STATES.FLOATING ) {

                this.#planetMovement();
            }
            
        } else {

            console.error( "Planet Gravity: Planet is null!" );
        }
    }

    #addPhysics() {

    }

    #spaceMovement() {

        let controls = this.#player.controls;
        let speed = this.#player.config.speed;
        let translate = new BABYLON.Vector3( 0, 0, 0 );

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

        let controls = this.#player.controls;
        let speed = this.#player.config.speed;
        let translate = new BABYLON.Vector3( 0, 0, 0 );

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

            this.#player.position.addInPlace( translate.applyRotationQuaternion( this.#player.rotationQuaternion ) );

        } else {
            
            
        }
    }
    
}