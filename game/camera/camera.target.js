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
        focusBeta: Math.PI / 2,

        lerpPos: 0.075,
        lerpRot: 0.05,

        follow: 0.0025
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

    focus( lerp = this.config.lerpRot ) {
        
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
        
        target.root.rotate( BABYLON.Axis.Y, event.event.movementX * this.config.follow * deltaCorrection, BABYLON.Space.LOCAL );
        target.root.rotate( BABYLON.Axis.X, event.event.movementY * this.config.follow * deltaCorrection, BABYLON.Space.LOCAL );
    }

    syncPosition( target ) {

        return BABYLON.Vector3.Lerp( this.camera.position, target.position.add( this.config.offset.applyRotationQuaternion( target.rotationQuaternion ) ), this.config.lerpPos );
    }
    
    syncRotationQuaternion( target ) {

        return BABYLON.Quaternion.Slerp( this.camera.rotationQuaternion, target.rotationQuaternion, this.config.lerpRot );
    }

    syncRadius( target ) {

        return BABYLON.Scalar.Lerp( this.camera.camera.radius, this.config.offsetRadius, this.config.lerpPos );
    }

    #syncWithTarget( target ) {

        this.camera.position.copyFrom( this.syncPosition( target ) );
        this.camera.rotationQuaternion.copyFrom( this.syncRotationQuaternion( target ) );
        this.camera.camera.radius = this.syncRadius( target );
    }

}