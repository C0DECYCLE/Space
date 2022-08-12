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

    static getFarAway() {

        return new BABYLON.Vector3( 0, 1000 * 1000 * 1000, 0 );
    }
    

    
    static createDummyField( scene, count, center, material ) {

        let dummies = [];

        for ( let i = 0; i < count; i++ ) {

            dummies.push( EngineUtils.createDummy( scene, undefined, material, 
                new BABYLON.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).scaleInPlace( 30 ).addInPlace( center ), 
                new BABYLON.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).scaleInPlace( Math.PI ) 
            ) );
        }

        dummies.update = () => {

            for ( let i = 0; i < dummies.length; i++ ) {

                //dummies[i].physics.update();
    
                //this.planets.list.get( 0 ).physics.pullPhysicsEntity( dummies[i] );
                //this.planets.list.get( 0 ).physics.collideHeightmap( dummies[i] );
                //this.planets.list.get( 0 ).physics.collideGroundBox( dummies[i] );
            }
        };

        return dummies;
    }
    
    static createDummy( scene, size = Math.round( Math.random() * 10 ) * 1, material, position, rotation ) {

        let dummy = {};

        dummy.root = BABYLON.MeshBuilder.CreateBox( "dummy", { size: size }, scene );
        dummy.root.position.copyFrom( position );
        dummy.root.rotationQuaternion = BABYLON.Quaternion.FromEulerVector( rotation );
        dummy.root.material = material;
        dummy.root.useLODScreenCoverage = true;
        dummy.root.addLODLevel( 0.0001, null );  
        dummy.root.isLODNull = () => dummy.root.getLOD( scene.activeCamera ) == null;
        dummy.root.physicsImpostor = new BABYLON.PhysicsImpostor( dummy.root, BABYLON.PhysicsImpostor.BoxImpostor, { mass: size/*, friction: 1, restitution: 0*/ }, scene ); 

        dummy.physics = new PhysicsEntity( dummy );

        return dummy;
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