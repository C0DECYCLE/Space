"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTargetPlayer extends CameraTarget {

    #spaceFocusBeta = Math.PI / 2;
    #planetFocusBeta = Math.PI / 2.5;
    
    #wasUnfocused = false;

    /* override */ update( player ) {

        this.#adaptFocus( player );

        super.update( player );

        if ( this.camera.controls.isKeyboarding === true ) {

            this.#refocus( player );
            this.focus( this.camera.config.lerp );

        } else {

            this.#wasUnfocused = true;
        }
    }

    /* override */ onPointerMove( player, event ) {

        if ( this.camera.controls.isPointerDown === true || this.camera.config.experimentalPointerLock === true ) {

            if ( this.camera.controls.isKeyboarding === true ) {

                this.followPointer( player, event );

            } else {

                this.free( event );
            }
        }
    }

    #adaptFocus( player ) {

        if ( player.state.is( "space" ) === true ) {

            this.focusBeta = this.#spaceFocusBeta;

        } else if ( player.state.is( "planet" ) === true ) {

            this.focusBeta = this.#planetFocusBeta;
        }
    }

    #refocus( player ) {

        if ( this.#wasUnfocused === true ) {

            this.redirect( player );
            this.focus();

            this.#wasUnfocused = false;
        }
    }

}