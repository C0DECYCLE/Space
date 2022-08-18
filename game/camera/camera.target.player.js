"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTargetPlayer extends CameraTarget {

    #wasUnfocused = false;

    constructor( camera ) {

        super( camera );
    }

    update( player ) {

        super.update( player );
        
        if ( this.camera.controls.isKeyboarding == true ) {

            this.#refocus( player );
            this.focus( this.camera.config.lerp );

        } else {

            this.#wasUnfocused = true;
        }
    }

    #refocus( player ) {

        if ( this.#wasUnfocused == true ) {

            this.#redirect( player );
            this.focus();

            this.#wasUnfocused = false;
        }
    }

    #redirect( player ) {

        player.root.rotate( BABYLON.Axis.Y, this.focusAlpha - this.camera.camera.alpha, BABYLON.Space.LOCAL );
        player.root.rotate( BABYLON.Axis.X, this.focusBeta - this.camera.camera.beta, BABYLON.Space.LOCAL );

        this.camera.rotationQuaternion.copyFrom( player.rotationQuaternion );
    }
}