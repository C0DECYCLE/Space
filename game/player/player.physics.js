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
    #controls = null;

    /* override */ constructor( player ) {

        super( player.game, player.root );
        
        this.#player = player;
        this.#controls = this.#player.controls;
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
            EngineUtils.setNodeDirection( this.#player.root, undefined, up, this.#player.config.standingup );
        }
    }

    #spaceshipUpdate() {
        
        this.velocity.copyFromFloats( 0, 0, 0 );
        
        this.#player.position.copyFrom( this.spaceship.position ).addInPlace( this.spaceship.config.seat.applyRotationQuaternion( this.spaceship.rotationQuaternion ) );
        this.#player.rotationQuaternion.copyFrom( this.spaceship.rotationQuaternion );
    }

    #spaceMovement() {

        const floatConfig = this.#player.config.float;
        const deltaCorrection = this.#player.game.engine.deltaCorrection;
        const translate = new BABYLON.Vector3( 0, 0, 0 );

        const float = floatConfig * deltaCorrection;

        if ( this.#controls.activeKeys.has( Controls.KEYS.for ) === true ) {

            translate.z = float;

        } else if ( this.#controls.activeKeys.has( Controls.KEYS.back ) === true ) {

            translate.z = -float;
        }
        
        if ( this.#controls.activeKeys.has( Controls.KEYS.right ) === true ) {

            translate.x = float;

        } else if ( this.#controls.activeKeys.has( Controls.KEYS.left ) === true ) {

            translate.x = -float;
        }
        
        if ( this.#controls.activeKeys.has( Controls.KEYS.up ) === true ) {

            translate.y = float;

        } else if ( this.#controls.activeKeys.has( Controls.KEYS.down ) === true ) {

            translate.y = -float;
        }

        if ( this.#controls.activeKeys.has( Controls.KEYS.leftRoll ) === true ) {

            this.#player.root.rotate( BABYLON.Axis.Z, float, BABYLON.Space.LOCAL );

        } else if ( this.#controls.activeKeys.has( Controls.KEYS.rightRoll ) === true ) {

            this.#player.root.rotate( BABYLON.Axis.Z, -float, BABYLON.Space.LOCAL );
        }

        this.#movementTranslate( translate );
    }

    #planetMovement() {

        const walkConfig = this.#player.config.walk;
        const runConfig = this.#player.config.run;
        const jumpConfig = this.#player.config.jump;
        const deltaCorrection = this.#player.game.engine.deltaCorrection;
        const translate = new BABYLON.Vector3( 0, 0, 0 );

        const walk = ( walkConfig / this.#planet.config.gravity ) * deltaCorrection;
        const run = ( runConfig / this.#planet.config.gravity ) * deltaCorrection;
        const jump = ( jumpConfig / this.#planet.config.gravity ) * deltaCorrection;

        let speed = walk;

        if ( this.#controls.activeKeys.has( Controls.KEYS.fast ) === true ) {

            speed = run;
        }

        if ( this.#controls.activeKeys.has( Controls.KEYS.for ) === true ) {

            translate.z = speed;

        } else if ( this.#controls.activeKeys.has( Controls.KEYS.back ) === true ) {

            translate.z = -speed;
        }
        
        if ( this.#controls.activeKeys.has( Controls.KEYS.right ) === true ) {

            translate.x = speed;

        } else if ( this.#controls.activeKeys.has( Controls.KEYS.left ) === true ) {

            translate.x = -speed;
        }

        if ( this.#controls.activeKeys.has( Controls.KEYS.jump ) === true ) {

            translate.y = jump;
        }

        this.#movementTranslate( translate );
    }

    #movementTranslate( translate ) {
        
        const deceleration = 1 - this.#player.config.deceleration;

        if ( translate.x !== 0 || translate.y !== 0 || translate.z !== 0 ) {

            this.velocity.addInPlace( translate.applyRotationQuaternionInPlace( this.#player.rotationQuaternion ) );   
        }
            
        this.velocity.scaleInPlace( deceleration );
    }
    
}