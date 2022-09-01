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

        focusBeta: Math.PI / 2.2
    };

    /* override */ constructor( camera, config ) {

        super( camera, config );
        
        EngineUtils.configure( this.config, config );
    }

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

        this.config.offsetRadius = EngineUtils.getBounding( spaceship.root ).size;
    }

}