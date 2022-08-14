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

    pullPhysicsEntity( entity, upright = false ) {

        let up = this.#getDiffrence( entity.position ).normalize();

        if ( entity.physics.state == PhysicsEntity.STATES.PLANETGROUND && upright == true ) {

            entity.physics.quaternionTowardsUpright( up, entity.config.standingup );
        }
        
        entity.root.physicsImpostor.applyForce( up.scaleInPlace( -this.#planet.config.gravity * 10 ), BABYLON.Vector3.Zero() );
    }

    collideHeightmap( entity ) {

        let diffrence = this.#getDiffrence( entity.position );
        let displace = this.#upToDisplaced( diffrence.clone().normalize() );
        let distance = diffrence.subtractInPlace( displace ).length();
        
        if ( distance <= 2 ) {
            
            entity.physics.state = PhysicsEntity.STATES.PLANETGROUND;

        } else {

            entity.physics.state = PhysicsEntity.STATES.FLOATING;
        }
    }
    
    createCollisionMesh( mesh, size ) {
        
        if ( size == this.#planet.config.min ) {

            mesh.physicsImpostor = new BABYLON.PhysicsImpostor( mesh, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0 }, this.#planet.scene );
        }
    }

    #getDiffrence( position ) {

        return position.subtract( this.#planet.position );
    }

    #upToDisplaced( up ) {

        let inPlanetRotation = up.rotateByQuaternionToRef( this.#planet.rotationQuaternion.invert(), BABYLON.Vector3.Zero() );

        return PlanetUtils.displace( inPlanetRotation, this.#planet ).rotateByQuaternionToRef( this.#planet.rotationQuaternion, BABYLON.Vector3.Zero() );
    }

}