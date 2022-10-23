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

    static createBoundingCache( node, scaling = null ) {
    
        const positionWorld = EngineUtils.getWorldPosition( node );

        const boundingCache = node.getHierarchyBoundingVectors( true );
        boundingCache.min.subtractInPlace( positionWorld );
        boundingCache.max.subtractInPlace( positionWorld );

        if ( scaling !== null ) {

            boundingCache.min.multiplyInPlace( scaling );
            boundingCache.max.multiplyInPlace( scaling );
        }

        boundingCache.diagonal = boundingCache.max.subtract( boundingCache.min );
        boundingCache.size = boundingCache.diagonal.length();

        return boundingCache;
    }

    static getBounding( node, force = false ) {
        
        if ( node.boundingCache === undefined || force === true ) {
            
            node.boundingCache = EngineUtils.createBoundingCache( node );
        }

        return node.boundingCache;
    }

    static getBoundingSize( node, force = false ) {

        return EngineUtils.getBounding( node, force ).size;
    }

    static getWorldPosition( node ) {
        
        const position = node.position.clone();
        
        EngineUtils.#recurseParentsPosition( position, node );
        
        return position;
    }

    static #recurseParentsPosition( result, node ) {

        if ( node.parent === null ) {

            return;
        }

        if ( !node.parent.scaling || !node.parent.rotationQuaternion || !node.parent.position ) {

            return;
        }
        
        result.multiplyInPlace( node.parent.scaling )
        .applyRotationQuaternionInPlace( node.parent.rotationQuaternion )
        .addInPlace( node.parent.position );

        EngineUtils.#recurseParentsPosition( result, node.parent );
    }

    static makeDebugMaterial( scene, color ) {

        const debugMaterial = new BABYLON.StandardMaterial( `debug_${ color }`, scene );
        EngineExtensions.setStandardMaterialColorIntensity( debugMaterial, color, 1.0 );
        debugMaterial.wireframe = true;
        debugMaterial.freeze();

        return debugMaterial;
    }

    static setNodeDirection( node, forward, up, lerp = undefined ) {

        const direction = BABYLON.Quaternion.FromLookDirectionRH( forward || node.forward, up || node.up );

        node.rotationQuaternion.copyFrom( lerp === undefined ? direction : BABYLON.Quaternion.Slerp( node.rotationQuaternion, direction, lerp ) );
    }

    static setDirection( rotationQuaternion, forward, yawCor = 0, pitchCor = 0, rollCor = 0 ) {

        const yaw = -Math.atan2( forward.z, forward.x ) + Math.PI / 2;
        const len = Math.sqrt( forward.x * forward.x + forward.z * forward.z );
        const pitch = -Math.atan2( forward.y, len );

        BABYLON.Quaternion.RotationYawPitchRollToRef( yaw + yawCor, pitch + pitchCor, rollCor, rotationQuaternion );
    }

    static rotate( rotationQuaternion, axis, value ) {

        rotationQuaternion.multiplyInPlace( BABYLON.Quaternion.RotationAxisToRef( axis, value, BABYLON.TransformNode._RotationAxisCache ) );
    }

    static minmax( vector ) {

        vector.min = Math.min( vector.x, vector.y, vector.z );
        vector.max = Math.max( vector.x, vector.y, vector.z );
        vector.biggest = Math.abs( vector.min ) > Math.abs( vector.max ) ? vector.min : vector.max;
    }

    static round( vector ) {

        vector.x = Math.round( vector.x );
        vector.y = Math.round( vector.y );
        vector.z = Math.round( vector.z );

        return vector;
    }

    static color3ToVector3( color ) {

        return new BABYLON.Vector3( color.r, color.g, color.b );
    }

}