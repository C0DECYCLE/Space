"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTargetSpaceship extends CameraTarget {

    /* override */ focusBeta = Math.PI / 2.2;

    /* override */ offsetRadius = 18;

    /* override */ update( spaceship ) {

        this.#adaptOffsetRadius( spaceship );

        super.update( spaceship );

        if ( this.camera.controls.activeKeys.has( "r" ) === false ) {

            this.focus( this.camera.config.lerp );
        }
    }

    /* override */ onPointerMove( spaceship, event ) {

        if ( this.camera.controls.isPointerDown === true || this.camera.config.experimentalPointerLock === true ) {

            if ( this.camera.controls.activeKeys.has( "r" ) === true ) {

                this.free( event );

            } else {

                this.followPointer( spaceship, event );
            }
        }
    }

    #adaptOffsetRadius( spaceship ) {

        this.offsetRadius = EngineUtils.getBounding( spaceship.root ).size;
    }

}