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

            if ( value !== undefined ) {

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

    static getBounding( node, force = false ) {
        
        if ( node.boundingCache === undefined || force === true ) {

            const minmax = node.getHierarchyBoundingVectors();

            node.boundingCache = minmax.max.subtract( minmax.min );
            node.boundingCache.size = node.boundingCache.length();
        }

        const bounding = node.boundingCache.clone();
        bounding.size = node.boundingCache.size;

        return bounding;
    }

    static getWorldPosition( node ) {
        
        const position = node.position.clone();
        
        EngineUtils.#recurseParentsPosition( position, node );
        
        return position;
    }

    static #recurseParentsPosition( result, node ) {

        if ( node.parent !== null ) {
            
            result.applyRotationQuaternionInPlace( node.parent.rotationQuaternion || node.parent.rotation.toQuaternion() );
            result.addInPlace( node.parent.position );

            EngineUtils.#recurseParentsPosition( result, node.parent );
        }
    }

    static makeDebugMaterial( scene ) {

        const debugMaterial = new BABYLON.StandardMaterial( "debug", scene );
        debugMaterial.setColorIntensity( "#ff226b", 1.0 );
        debugMaterial.wireframe = true;

        return debugMaterial;
    }

}