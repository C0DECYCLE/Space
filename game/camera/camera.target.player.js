"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTargetPlayer extends CameraTarget {

    /* override */ config = {

        offset: new BABYLON.Vector3( 0, 1, 0 ),
        offsetRadius: 8,

        spaceFocusBeta: Math.PI / 2,
        planetFocusBeta: Math.PI / 2.5
    };
    
    #wasUnfocused = false;

    /* override */ constructor( camera, config ) {

        super( camera, config );
        
        EngineUtils.configure.call( this, config );
    }

    /* override */ update( player ) {

        this.#adaptFocus( player );

        super.update( player );

        if ( this.camera.controls.isKeyboarding === true ) {

            this.#refocus( player );
            this.focus();

        } else {

            this.#wasUnfocused = true;
        }
    }

    /* override */ onPointerMove( player, event ) {

        if ( this.camera.controls.isPointerDown === true || this.camera.controls.config.experimentalPointerLock === true ) {

            if ( this.camera.controls.isKeyboarding === true ) {

                this.followPointer( player, event );

            } else {

                this.free( event );
            }
        }
    }

    #adaptFocus( player ) {

        if ( player.state.is( "space" ) === true ) {
            
            this.config.focusBeta = this.config.spaceFocusBeta;

        } else if ( player.state.is( "planet" ) === true ) {

            this.config.focusBeta = this.config.planetFocusBeta;
        }
    }

    #refocus( player ) {

        if ( this.#wasUnfocused === true ) {

            this.redirect( player );
            this.focus( 1.0 );

            this.#wasUnfocused = false;
        }
    }

}