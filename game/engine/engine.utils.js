"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EngineUtils {

    static toAngle = 180 / Math.PI;
    
    static toRadian = Math.PI / 180;

    static vectorRotation( vector, rotation ) {

        const quat = BABYLON.Quaternion.FromEulerVector( rotation );

        return vector.rotateByQuaternionToRef( quat, BABYLON.Vector3.Zero() );
    }
    
    /*
    static rotateVector( vector, axis, radian ) {

        let matrix = BABYLON.Matrix.RotationAxis( BABYLON.Axis[ axis.toUpperCase() ], radian );

        vector.copyFrom( BABYLON.Vector3.TransformCoordinates( vector, matrix ) );
    }
    */

    /*
    static rotationForwardUp( mesh, forward, up ) {

        mesh.rotationQuaternion = BABYLON.Quaternion.FromLookDirectionLH( forward, up );
    }
    */
   
    /*
    let debug = BABYLON.MeshBuilder.CreateSphere( "debug", { diameter: 10, segments: 1 }, scene );
    debug.material = new BABYLON.StandardMaterial( "debug_material", scene );
    debug.material.diffuseColor = BABYLON.Color3.FromHexString("#ff226b");
    debug.material.emissiveColor = BABYLON.Color3.FromHexString("#120B25");
    debug.material.specularColor.set( 0, 0, 0 );;
    debug.position.copyFrom( terrainifyPosition ).scaleInPlace( 1.05 );
    debug.parent = this.#planet.root;
    */

    /*
    this.camera.rotationQuaternion = BABYLON.Quaternion.Slerp( this.camera.rotationQuaternion, this.target.root.rotationQuaternion, 0.1 );
    //let offrot = new BABYLON.Quaternion.RotationAxis( this.target.root.right, -Math.PI / 4 );
    let endPosition = this.target.root.position.add( offset.applyRotationQuaternion( this.target.root.rotationQuaternion ) );
    this.camera.position = BABYLON.Vector3.Lerp( this.camera.position, endPosition, 0.1 );
    */

    /*
    player.mesh.rotationQuaternion = BABYLON.Quaternion.Slerp(
        player.mesh.rotationQuaternion,
        BABYLON.Quaternion.FromLookDirectionLH(
            player.camera.camera.position.normalizeToNew(),
            player.camera.camera.upVector//EngineUtils.vectorRotation( player.camera.camera.position.normalizeToNew(), new BABYLON.Vector3( Math.PI / 2, 0, 0 ) )
        ),
        1.0
    );
    */
}