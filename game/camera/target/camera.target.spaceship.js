"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTargetSpaceship extends CameraTarget {

    /* override */ config = {

        offset: new BABYLON.Vector3( 0, 0, 0 ),
        offsetRadius: 18,

        focusBeta: Math.PI / 2.2,

        lerpPos: 0.1,
        lerpRot: 0.025,

        follow: 0.0015
    };

    #followXVelocity = 0;
    #followYVelocity = 0;

    /* override */ constructor( camera, config ) {

        super( camera, config );
        
        EngineUtils.configure.call( this, config );
    }

    /* override */ update( spaceship ) {

        this.#adaptOffsetRadius( spaceship );

        super.update( spaceship );

        if ( this.camera.controls.activeKeys.has( Controls.KEYS.free ) === false && spaceship.isLanded === false && spaceship.physics.travel.isJumping === false ) {

            this.focus();
        }

        this.#applyFollowVelocity( spaceship );
    }

    /* override */ onPointerMove( spaceship, event ) {

        if ( this.camera.controls.isPointerDown === true || this.camera.controls.config.experimentalPointerLock === true ) {

            if ( this.camera.controls.activeKeys.has( Controls.KEYS.free ) === true || spaceship.isLanded === true || spaceship.physics.travel.isJumping === true ) {

                this.free( event );

            } else {

                this.followPointer( spaceship, event );
            }
        }
    }

    /* override */ followPointer( spaceship, event ) {
        
        this.#followXVelocity += event.event.movementX * this.config.follow * 0.1;
        this.#followYVelocity += event.event.movementY * this.config.follow * 0.1;
    }

    /* override */ syncPosition( spaceship ) {

        if ( spaceship.physics.travel.isJumping === true ) {

            return spaceship.position.add( this.config.offset.applyRotationQuaternion( spaceship.rotationQuaternion ) );
        }
        
        return super.syncPosition( spaceship );
    }

    #adaptOffsetRadius( spaceship ) {

        this.config.offsetRadius = EngineUtils.getBoundingSize( spaceship.root ) * 1.2;
    }

    #applyFollowVelocity( spaceship ) {

        const deltaCorrection = this.camera.game.engine.deltaCorrection;

        spaceship.root.rotate( BABYLON.Axis.Y, this.#followXVelocity * deltaCorrection, BABYLON.Space.LOCAL );
        spaceship.root.rotate( BABYLON.Axis.X, this.#followYVelocity * deltaCorrection, BABYLON.Space.LOCAL );

        this.#followXVelocity = BABYLON.Scalar.Lerp( this.#followXVelocity, 0, 0.05 );
        this.#followYVelocity = BABYLON.Scalar.Lerp( this.#followYVelocity, 0, 0.05 );
    }

}