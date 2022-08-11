"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Entity extends BABYLON.TransformNode {

    originPosition = new BABYLON.Vector3( 0, 0, 0 );

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