"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTarget {

    config = {

        offset: new BABYLON.Vector3( 0, 0, 0 ),
        offsetRadius: 10,

        focusAlpha: -Math.PI / 2,
        focusBeta: Math.PI / 2
    };

    camera = null;

    constructor( camera, config ) {

        this.camera = camera;

        EngineUtils.configure.call( this, config );
    }

    update( target ) {

        this.#syncWithTarget( target );
    }

    onPointerMove( target, event ) {
        
        return;
    }

    redirect( target ) {

        target.root.rotate( BABYLON.Axis.Y, this.config.focusAlpha - this.camera.camera.alpha, BABYLON.Space.LOCAL );
        target.root.rotate( BABYLON.Axis.X, this.config.focusBeta - this.camera.camera.beta, BABYLON.Space.LOCAL );

        this.camera.rotationQuaternion.copyFrom( target.rotationQuaternion );
    }

    focus( lerp = 1.0 ) {
        
        this.camera.camera.alpha = BABYLON.Scalar.Lerp( this.camera.camera.alpha, this.config.focusAlpha, lerp );
        this.camera.camera.beta = BABYLON.Scalar.Lerp( this.camera.camera.beta, this.config.focusBeta, lerp );
    }
    
    free( event ) {

        const deltaCorrection = this.camera.game.engine.deltaCorrection;

        this.camera.camera.alpha -= event.event.movementX * this.camera.controls.config.panning * deltaCorrection;
        this.camera.camera.beta -= event.event.movementY * this.camera.controls.config.panning * deltaCorrection;
    }

    followPointer( target, event ) {
        
        const deltaCorrection = this.camera.game.engine.deltaCorrection;
        
        target.root.rotate( BABYLON.Axis.Y, event.event.movementX * this.camera.controls.config.panning * deltaCorrection, BABYLON.Space.LOCAL );
        target.root.rotate( BABYLON.Axis.X, event.event.movementY * this.camera.controls.config.panning * deltaCorrection, BABYLON.Space.LOCAL );
    }

    #syncWithTarget( target ) {

        this.camera.position.copyFrom( BABYLON.Vector3.Lerp( this.camera.position, target.position.add( this.config.offset.applyRotationQuaternion( target.rotationQuaternion ) ), this.camera.config.lerp ) );
        this.camera.rotationQuaternion.copyFrom( BABYLON.Quaternion.Slerp( this.camera.rotationQuaternion, target.rotationQuaternion, this.camera.config.lerp ) );

        this.camera.camera.radius = BABYLON.Scalar.Lerp( this.camera.camera.radius, this.config.offsetRadius, this.camera.config.lerp );
    }

}