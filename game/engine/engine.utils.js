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

    static vectorRotation( vector, rotation ) {

        const quat = BABYLON.Quaternion.FromEulerVector( rotation );

        return vector.rotateByQuaternionToRef( quat, BABYLON.Vector3.Zero() );
    }

    static getFarAway() {

        return new BABYLON.Vector3( 0, 1000 * 1000 * 1000, 0 );
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    static createDummyField( scene, count, center, material, star ) {

        const dummies = [];

        dummies.root = new BABYLON.TransformNode( "dummies", scene );
        dummies.root.rotationQuaternion = dummies.root.rotation.toQuaternion();

        for ( let i = 0; i < count; i++ ) {

            const dummy = EngineUtils.createDummy( scene, i, undefined, material, star, 
                new BABYLON.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).scaleInPlace( 30 ).addInPlace( center ), 
                new BABYLON.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).scaleInPlace( Math.PI ) 
            );

            dummy.root.parent = dummies.root;
            dummies.push( dummy );
        }

        dummies.update = () => {

            for ( let i = 0; i < dummies.length; i++ ) {

                star.manager.planets.list.get( 3 ).physics.pull( dummies[i].physics );

                dummies[i].physics.update();
            }
        };

        return dummies;
    }
    
    static createDummy( scene, i, size = Math.round( Math.random() * 10 ) * 1, material, star, position, rotation ) {

        const dummy = {

            get position() {
                
                return dummy.root.position;
            },

            get rotationQuaternion() {
                
                return dummy.root.rotationQuaternion;
            }
        };

        dummy.root = BABYLON.MeshBuilder.CreateBox( `dummy${ i }`, { size: size }, scene );
        dummy.root.position.copyFrom( position );
        dummy.root.rotationQuaternion = BABYLON.Quaternion.FromEulerVector( rotation );
        dummy.root.material = material;
        dummy.root.useLODScreenCoverage = true;
        dummy.root.addLODLevel( 0.0001, null );  
        dummy.root.isLODNull = () => dummy.root.getLOD( scene.activeCamera ) == null;

        dummy.physics = new PhysicsEntity( dummy.root, PhysicsEntity.TYPES.DYNAMIC );

        star.shadow.cast( dummy.root, true, false );
        star.shadow.receive( dummy.root, true, true );

        return dummy;
    }

}