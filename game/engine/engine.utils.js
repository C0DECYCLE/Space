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
        
        if ( this.__config === undefined ) {

            this.__config = target;
            
        } else {

            target = Object.assign( this.__config, target );
        }
        log(this);
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
            
            result.multiplyInPlace( node.parent.scaling )
            .applyRotationQuaternionInPlace( node.parent.rotationQuaternion )
            .addInPlace( node.parent.position );

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