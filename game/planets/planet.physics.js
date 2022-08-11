"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetPhysics {

    parent = null;

    constructor( parent ) {

        this.parent = parent;
    }

    pullPhysicsEntity( entity, upright = false/*, calm = false*/ ) {

        let up = this.#getDiffrence( entity.root.position ).normalize();

        if ( entity.physics.state == PhysicsEntity.STATES.PLANETGROUND && upright == true ) {

            entity.physics.quaternionTowardsUpright( up, entity.config.standingup );
        }
        
        if ( entity.physics.state == PhysicsEntity.STATES.FLOATING ) {
            
            entity.root.physicsImpostor.applyForce( up.scaleInPlace( -this.parent.config.gravity * 10 ), BABYLON.Vector3.Zero() );
        
        }/* else {

            if ( calm == true ) {

                entity.root.physicsImpostor.setLinearVelocity( BABYLON.Vector3.Zero() );
            }
        }*/
    }

    collideHeightmap( entity ) {

        let diffrence = this.#getDiffrence( entity.root.position );
        let displace = this.#upToDisplaced( diffrence.clone().normalize() );
        let distance = diffrence.subtractInPlace( displace ).length();
        
        if ( distance <= 1.5 ) {

            entity.physics.state = PhysicsEntity.STATES.PLANETGROUND;
            entity.root.physicsImpostor.setLinearVelocity( BABYLON.Vector3.Zero() );

        } else {

            entity.physics.state = PhysicsEntity.STATES.FLOATING;
        }
    }
    /*
    collideGroundBox( entity ) {
        
        let center = this.#upToDisplaced( this.#getDiffrence( entity.root.position ).normalize() );
        let forward = this.#upToDisplaced( this.#getDiffrence( entity.root.position.add( entity.root.forward.scale( 3 ) ) ).normalize() );
        let right = this.#upToDisplaced( this.#getDiffrence( entity.root.position.add( entity.root.right.scale( 3 ) ) ).normalize() );

        let up = BABYLON.Vector3.Cross( forward.subtractInPlace( center ), right.subtractInPlace( center ) ).normalize();

        entity.physics.box.position.copyFrom( this.parent.root.position ).addInPlace( center );
        entity.physics.box.rotationQuaternion.copyFrom( BABYLON.Quaternion.FromLookDirectionRH( entity.physics.box.forward, up ) );
    }
    */
    #getDiffrence( position ) {

        return position.subtract( this.parent.root.position );
    }

    #upToDisplaced( up ) {

        let inPlanetRotation = up.rotateByQuaternionToRef( this.parent.root.rotationQuaternion.invert(), BABYLON.Vector3.Zero() );

        return PlanetUtils.displace( inPlanetRotation, this.parent ).rotateByQuaternionToRef( this.parent.root.rotationQuaternion, BABYLON.Vector3.Zero() );
    }

}