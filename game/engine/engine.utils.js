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

    static configure( inject ) {

        const keys = Object.keys( this.config );

        for ( let i = 0; i < keys.length; i++ ) {

            const key = keys[i];
            const value = inject[ key ];

            if ( value !== undefined ) {

                this.config[ key ] = value;
            }
        }
        
        if ( this.__config === undefined ) {

            this.__config = this.config;
            
        } else {

            this.config = Object.assign( this.__config, this.config );
        }
    }

    static getFarAway() {

        return new BABYLON.Vector3( 0, 1000 * 1000 * 1000, 0 );
    }

    static getBounding( node, force = false, filter = undefined ) {
        
        if ( node.boundingCache === undefined || force === true ) {

            const minmax = node.getHierarchyBoundingVectors( true, filter );

            node.boundingCache = minmax.max.subtract( minmax.min );
            node.boundingCache.offset = node.boundingCache.scale( 0.5 ).addInPlace( minmax.min ).subtractInPlace( node.position );
            node.boundingCache.size = node.boundingCache.length();
        }

        const bounding = node.boundingCache.clone();
        bounding.offset = node.boundingCache.offset;
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

    static setNodeDirection( node, forward, up, lerp = undefined ) {

        const direction = BABYLON.Quaternion.FromLookDirectionRH( forward || node.forward, up || node.up );

        node.rotationQuaternion.copyFrom( lerp === undefined ? direction : BABYLON.Quaternion.Slerp( node.rotationQuaternion, direction, lerp ) );
    }

    static minmax( vector ) {

        vector.min = Math.min( vector.x, vector.y, vector.z );
        vector.max = Math.max( vector.x, vector.y, vector.z );
        vector.biggest = Math.abs( vector.min ) > Math.abs( vector.max ) ? vector.min : vector.max;
    }

}