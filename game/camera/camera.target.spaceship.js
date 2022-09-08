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

    /* override */ constructor( camera, config ) {

        super( camera, config );
        
        EngineUtils.configure.call( this, config );
    }

    /* override */ update( spaceship ) {

        this.#adaptOffsetRadius( spaceship );

        super.update( spaceship );

        if ( this.camera.controls.activeKeys.has( Controls.KEYS.free ) === false && spaceship.physics.travel.isJumping === false ) {

            this.focus();
        }
    }

    /* override */ onPointerMove( spaceship, event ) {

        if ( this.camera.controls.isPointerDown === true || this.camera.controls.config.experimentalPointerLock === true ) {

            if ( this.camera.controls.activeKeys.has( Controls.KEYS.free ) === true || spaceship.physics.travel.isJumping === true ) {

                this.free( event );

            } else {

                this.followPointer( spaceship, event );
            }
        }
    }

    /* override */ syncPosition( spaceship ) {

        if ( spaceship.physics.travel.isJumping === true ) {

            return spaceship.position.add( this.config.offset.applyRotationQuaternion( spaceship.rotationQuaternion ) );
        }
        
        return super.syncPosition( spaceship );
    }

    #adaptOffsetRadius( spaceship ) {

        this.config.offsetRadius = EngineUtils.getBounding( spaceship.root ).size;
    }

}