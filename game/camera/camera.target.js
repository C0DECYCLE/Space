"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTarget {

    focusAlpha = -Math.PI / 2;
    focusBeta = Math.PI / 2;

    offset = new BABYLON.Vector3( 0, 1, 0 );
    offsetRadius = 8;

    camera = null;
    
    #wasUnfocused = false;

    constructor( camera ) {

        this.camera = camera;
    }

    update( target ) {

        this.#syncWithTarget( target );

        if ( this.camera.controls.isKeyboarding === true ) {

            this.#refocus( target );
            this.focus( this.camera.config.lerp );

        } else {

            this.#wasUnfocused = true;
        }
    }

    #syncWithTarget( target ) {

        this.camera.position.copyFrom( BABYLON.Vector3.Lerp( this.camera.position, target.position.add( this.offset.applyRotationQuaternion( target.rotationQuaternion ) ), this.camera.config.lerp ) );
        this.camera.rotationQuaternion.copyFrom( BABYLON.Quaternion.Slerp( this.camera.rotationQuaternion, target.rotationQuaternion, this.camera.config.lerp ) );

        this.camera.camera.radius = BABYLON.Scalar.Lerp( this.camera.camera.radius, this.offsetRadius, this.camera.config.lerp );
    }

    #refocus( target ) {

        if ( this.#wasUnfocused === true ) {

            this.#redirect( target );
            this.focus();

            this.#wasUnfocused = false;
        }
    }

    #redirect( target ) {

        target.root.rotate( BABYLON.Axis.Y, this.focusAlpha - this.camera.camera.alpha, BABYLON.Space.LOCAL );
        target.root.rotate( BABYLON.Axis.X, this.focusBeta - this.camera.camera.beta, BABYLON.Space.LOCAL );

        this.camera.rotationQuaternion.copyFrom( target.rotationQuaternion );
    }

    focus( lerp = 1.0 ) {
        
        this.camera.camera.alpha = BABYLON.Scalar.Lerp( this.camera.camera.alpha, this.focusAlpha, lerp );
        this.camera.camera.beta = BABYLON.Scalar.Lerp( this.camera.camera.beta, this.focusBeta, lerp );
    }
}