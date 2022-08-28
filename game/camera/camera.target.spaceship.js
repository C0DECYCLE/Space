"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTargetSpaceship extends CameraTarget {

    focusBeta = Math.PI / 2.5;

    #wasUnfocused = false;

    /* override */ update( spaceship ) {

        super.update( spaceship );
        
        if ( this.camera.controls.isKeyboarding === true ) {

            this.#refocus( spaceship );
            this.focus( this.camera.config.lerp );

        } else {

            this.#wasUnfocused = true;
        }
    }

    #refocus( spaceship ) {

        if ( this.#wasUnfocused === true ) {

            this.#redirect( spaceship );
            this.focus();

            this.#wasUnfocused = false;
        }
    }

    #redirect( spaceship ) {

        spaceship.root.rotate( BABYLON.Axis.Y, this.focusAlpha - this.camera.camera.alpha, BABYLON.Space.LOCAL );
        spaceship.root.rotate( BABYLON.Axis.X, this.focusBeta - this.camera.camera.beta, BABYLON.Space.LOCAL );

        this.camera.rotationQuaternion.copyFrom( spaceship.rotationQuaternion );
    }
}