"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Entity extends BABYLON.TransformNode {

    physicsBody = null;

    originPosition = new BABYLON.Vector3( 0, 0, 0 );
    originManualUpdate = false;

    #camera = null;

    constructor( name, scene, camera ) {

        super( `${ name }_entity`, scene );

        this.#camera = camera;

        this.inspectableCustomProperties = [
            {
                label: "Origin Position",
                propertyName: "originPosition",
                type: BABYLON.InspectableType.Vector3,
            }
        ];

        this.rotationQuaternion = this.rotation.toQuaternion();

        this.#camera.add( this );
    }

    originUpdate() {

        if ( this.physicsBody != null ) {

            if ( this.originManualUpdate == false ) {

                this.originPosition.copyFromFloats( this.physicsBody.position.x, this.physicsBody.position.y, this.physicsBody.position.z );

            } else {

                this.physicsBody.position.set( this.originPosition.x, this.originPosition.y, this.originPosition.z );
                this.originManualUpdate = false;
            }
        }

        this.position.copyFrom( this.originPosition ).subtractInPlace( this.#camera.originPosition );
    }

    computeOriginMatrix() {

        let matrix = new BABYLON.Matrix();
        
        BABYLON.Matrix.FromQuaternionToRef( this.rotationQuaternion, matrix );

        return matrix.setTranslation( this.originPosition );
    }

    dispose( /*BABYLON ARGUMENTS*/ ) {

        this.#camera.remove( this );

        super.dispose( ...arguments );
    }
}