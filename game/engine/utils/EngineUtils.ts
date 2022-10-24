/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface BABYLON.Node {

    boundingCache: IBoundingCache;

}

class EngineUtils implements IEngineUtils {

    public static readonly toAngle: number = 180 / Math.PI;
    public static readonly toRadian: number = Math.PI / 180;

    public static getDeltaCorrection( delta: number, fpsTarget: number ): number {

        return delta * fpsTarget / 1000;
    }

    public static configure( self: IConfigurable, inject: IConfig ): void {

        const keys: string[] = Object.keys( self.config );

        for ( let i: number = 0; i < keys.length; i++ ) {

            const key: string = keys[i];
            const value: any = inject[ key ];

            if ( value !== undefined ) {

                self.config[ key ] = value;
            }
        }
        
        if ( self.__config === undefined ) {

            self.__config = self.config;
            
        } else {

            self.config = Object.assign( self.__config, self.config );
        }
    }

    public static getFarAway(): BABYLON.Vector3 {

        return new BABYLON.Vector3( 0, 1000 * 1000 * 1000, 0 );
    }

    public static createBoundingCache( node: BABYLON.Node, scaling?: BABYLON.Vector3 ): IBoundingCache {
    
        const positionWorld: BABYLON.Vector3 = EngineUtils.getWorldPosition( node );
        const boundingCache: IBoundingCache = new BoundingCache( node );

        boundingCache.min.subtractInPlace( positionWorld );
        boundingCache.max.subtractInPlace( positionWorld );

        if ( scaling instanceof BABYLON.Vector3 ) {

            boundingCache.min.multiplyInPlace( scaling );
            boundingCache.max.multiplyInPlace( scaling );
        }

        boundingCache.update();

        return boundingCache;
    }

    public static getBounding( node: BABYLON.Node, force: boolean = false ): IBoundingCache {
        
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