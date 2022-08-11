"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetPhysics {

    #planet = null;

    constructor( planet ) {

        this.#planet = planet;
    }

    pullPhysicsEntity( entity, upright = false/*, calm = false*/ ) {

        let up = this.#getDiffrence( entity.root.position ).normalize();

        if ( entity.physics.state == PhysicsEntity.STATES.PLANETGROUND && upright == true ) {

            entity.physics.quaternionTowardsUpright( up, entity.config.standingup );
        }
        
        //if ( entity.physics.state == PhysicsEntity.STATES.FLOATING ) {
            
            entity.root.physicsImpostor.applyForce( up.scaleInPlace( -this.#planet.config.gravity * 10 ), BABYLON.Vector3.Zero() );
        
        /*}*//* else {

            if ( calm == true ) {

                entity.root.physicsImpostor.setLinearVelocity( BABYLON.Vector3.Zero() );
            }
        }*/
    }

    collideHeightmap( entity ) {

        let diffrence = this.#getDiffrence( entity.root.position );
        let displace = this.#upToDisplaced( diffrence.clone().normalize() );
        let distance = diffrence.subtractInPlace( displace ).length();
        
        if ( distance <= 2 ) {
            log("ground")
            entity.physics.state = PhysicsEntity.STATES.PLANETGROUND;
            //entity.root.physicsImpostor.setLinearVelocity( BABYLON.Vector3.Zero() );

        } else {

            entity.physics.state = PhysicsEntity.STATES.FLOATING;
        }
    }
    /*
    collideGroundBox( entity ) {
        
        let diffrence = this.#getDiffrence( entity.root.position );
        let center = this.#upToDisplaced( diffrence.clone().normalize() );
        let forward = this.#upToDisplaced( this.#getDiffrence( entity.root.position.add( entity.root.forward.scale( 3 ) ) ).normalize() );
        let right = this.#upToDisplaced( this.#getDiffrence( entity.root.position.add( entity.root.right.scale( 3 ) ) ).normalize() );
        let distance = diffrence.subtractInPlace( center ).length();

        let up = BABYLON.Vector3.Cross( forward.subtractInPlace( center ), right.subtractInPlace( center ) ).normalize();

        entity.physics.box.position.copyFrom( this.#planet.root.position ).addInPlace( center );
        entity.physics.box.rotationQuaternion.copyFrom( BABYLON.Quaternion.FromLookDirectionRH( entity.physics.box.forward, up ) );

        if ( distance <= 1.5 ) {

            entity.physics.state = PhysicsEntity.STATES.PLANETGROUND;

        } else {

            entity.physics.state = PhysicsEntity.STATES.FLOATING;
        }
    }
    */
    createCollisionMesh( mesh, size ) {
        
        if ( size == this.#planet.config.min ) {

            mesh.physicsImpostor = new BABYLON.PhysicsImpostor( mesh, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0 }, this.#planet.scene );
        
            //if ( this.#planet.root.physicsImpostor ) this.#planet.root.physicsImpostor.dispose();
            //this.#planet.root.physicsImpostor = new BABYLON.PhysicsImpostor( this.#planet.root, BABYLON.PhysicsImpostor.NoImpostor, { mass: 0/*, friction: 0.9, restitution: 0.1*/ }, this.#planet.scene );
        }
    }

    #getDiffrence( position ) {

        return position.subtract( this.#planet.root.position );
    }

    #upToDisplaced( up ) {

        let inPlanetRotation = up.rotateByQuaternionToRef( this.#planet.root.rotationQuaternion.invert(), BABYLON.Vector3.Zero() );

        return PlanetUtils.displace( inPlanetRotation, this.#planet ).rotateByQuaternionToRef( this.#planet.root.rotationQuaternion, BABYLON.Vector3.Zero() );
    }

}