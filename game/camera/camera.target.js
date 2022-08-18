"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTarget {

    focusAlpha = -Math.PI / 2;
    focusBeta = Math.PI / 2;

    camera = null;
    
    constructor( camera ) {

        this.camera = camera;
    }

    update( target ) {

        this.#syncWithTarget( target );
    }

    #syncWithTarget( target ) {

        this.camera.position.copyFrom( BABYLON.Vector3.Lerp( this.camera.position, target.position, this.camera.config.lerp ) );
        this.camera.rotationQuaternion.copyFrom( BABYLON.Quaternion.Slerp( this.camera.rotationQuaternion, target.rotationQuaternion, this.camera.config.lerp ) );
    }

    focus( lerp = 1.0 ) {
        
        this.camera.camera.alpha = BABYLON.Scalar.Lerp( this.camera.camera.alpha, this.focusAlpha, lerp );
        this.camera.camera.beta = BABYLON.Scalar.Lerp( this.camera.camera.beta, this.focusBeta, lerp );
    }
}