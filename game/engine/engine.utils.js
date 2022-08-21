"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EngineUtils {

    static toAngle = 180 / Math.PI;
    static toRadian = Math.PI / 180;

    static getDeltaCorrection( delta, fpsTarget ) {

        return delta * fpsTarget / 1000;
    }

    static configure( target, inject ) {

        const keys = Object.keys( target );

        for ( let i = 0; i < keys.length; i++ ) {

            const key = keys[i];
            const value = inject[ key ];

            if ( value != undefined ) {

                target[ key ] = value;
            }
        }
    }

    static vectorRotation( vector, rotation ) {

        const quat = BABYLON.Quaternion.FromEulerVector( rotation );

        return vector.rotateByQuaternionToRef( quat, BABYLON.Vector3.Zero() );
    }

    static getFarAway() {

        return new BABYLON.Vector3( 0, 1000 * 1000 * 1000, 0 );
    }

}