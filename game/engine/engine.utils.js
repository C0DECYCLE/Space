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
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
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

        let dummy = {

            get position() {
                
                return dummy.root.position;
            },

            get rotationQuaternion() {
                
                return dummy.root.rotationQuaternion;
            }
        };

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

}