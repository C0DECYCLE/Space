"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerPhysics extends PhysicsEntity {

    #player = null;
    #planet = null;
    #spaceship = null;

    constructor( player ) {

        super( player.root, PhysicsEntity.TYPES.DYNAMIC );
        
        this.#player = player;
    }

    set planet( value ) {

        this.#planet = value;
    }
    
    get planet() {

        return this.#planet;
    }

    set spaceship( value ) {

        this.#spaceship = value;
    }
    
    get spaceship() {

        return this.#spaceship;
    }

    /* override */ update() {
        
        if ( this.#player.state.is( "space" ) === true ) {

            this.#spaceUpdate();

        } else if ( this.#player.state.is( "planet" ) === true ) {

            this.#planetUpdate();

        } else if ( this.#player.state.is( "spaceship" ) === true ) {

            this.#spaceshipUpdate();
        }

        super.update();
    }

    #spaceUpdate() {

        this.#spaceMovement();
    }

    #planetUpdate() {

        const up = this.#planet.physics.pull( this );

        if ( this.state === PhysicsEntity.STATES.GROUND ) {

            this.#planetMovement();
            this.quaternionTowardsUpright( up, 0.1 );
        }
    }

    #spaceshipUpdate() {
        
        this.#player.position.copyFrom( this.spaceship.position ).addInPlace( this.spaceship.seatOffset.applyRotationQuaternion( this.spaceship.rotationQuaternion ) );
        this.#player.rotationQuaternion.copyFrom( this.spaceship.rotationQuaternion );
    }

    #spaceMovement() {

        const controls = this.#player.controls;
        const floatConfig = this.#player.config.float;
        const deltaCorrection = this.#player.game.engine.deltaCorrection;
        const translate = new BABYLON.Vector3( 0, 0, 0 );

        const float = floatConfig * deltaCorrection;

        let speed = float;

        if ( controls.activeKeys.has( "w" ) === true ) {

            translate.z = speed;

        } else if ( controls.activeKeys.has( "s" ) === true ) {

            translate.z = -speed;
        }
        
        if ( controls.activeKeys.has( "d" ) === true ) {

            translate.x = speed;

        } else if ( controls.activeKeys.has( "a" ) === true ) {

            translate.x = -speed;
        }
        
        if ( controls.activeKeys.has( "q" ) === true ) {

            translate.y = speed;

        } else if ( controls.activeKeys.has( "e" ) === true ) {

            translate.y = -speed;
        }

        this.#movementTranslate( translate );
    }

    #planetMovement() {

        const controls = this.#player.controls;
        const walkConfig = this.#player.config.walk;
        const runConfig = this.#player.config.run;
        const jumpConfig = this.#player.config.jump;
        const deltaCorrection = this.#player.game.engine.deltaCorrection;
        const translate = new BABYLON.Vector3( 0, 0, 0 );

        const walk = ( walkConfig / this.#planet.config.gravity ) * deltaCorrection;
        const run = ( runConfig / this.#planet.config.gravity ) * deltaCorrection;
        const jump = ( jumpConfig / this.#planet.config.gravity ) * deltaCorrection;

        let speed = walk;

        if ( controls.activeKeys.has( "shift" ) === true ) {

            speed = run;
        }

        if ( controls.activeKeys.has( "w" ) === true ) {

            translate.z = speed;

        } else if ( controls.activeKeys.has( "s" ) === true ) {

            translate.z = -speed;
        }
        
        if ( controls.activeKeys.has( "d" ) === true ) {

            translate.x = speed;

        } else if ( controls.activeKeys.has( "a" ) === true ) {

            translate.x = -speed;
        }

        if ( controls.activeKeys.has( " " ) === true ) {

            translate.y = jump * deltaCorrection;
        }

        this.#movementTranslate( translate );
    }

    #movementTranslate( translate ) {
        
        if ( translate.x !== 0 || translate.y !== 0 || translate.z !== 0 ) {

            this.velocity.addInPlace( translate.applyRotationQuaternion( this.#player.rotationQuaternion ) );   
        }
            
        this.velocity.scaleInPlace( 0.85 );
    }
    
}