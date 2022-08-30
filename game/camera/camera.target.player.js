"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTargetPlayer extends CameraTarget {

    #spaceFocusBeta = Math.PI / 2;
    #planetFocusBeta = Math.PI / 2.5;

    /* override */ update( player ) {

        this.#adaptFocus( player );

        super.update( player );
    }

    #adaptFocus( player ) {

        if ( player.state.is( "space" ) === true ) {

            this.focusBeta = this.#spaceFocusBeta;

        } else if ( player.state.is( "planet" ) === true ) {

            this.focusBeta = this.#planetFocusBeta;
        }
    }

}