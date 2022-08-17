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

        const up = this.#getDiffrence( entity.position ).normalize();

        if ( entity.physics.state == PhysicsEntity.STATES.PLANETGROUND && upright == true ) {

            entity.physics.quaternionTowardsUpright( up, entity.config.standingup );
        }
        
        //up.scaleInPlace( -this.#planet.config.gravity * 10 )
    }

    collideHeightmap( entity ) {

        const diffrence = this.#getDiffrence( entity.position );
        const displace = this.#upToDisplaced( diffrence.clone().normalize() );
        const distance = diffrence.subtractInPlace( displace ).length();
        
        if ( distance <= 2 ) {
            
            entity.physics.state = PhysicsEntity.STATES.PLANETGROUND;

        } else {

            entity.physics.state = PhysicsEntity.STATES.FLOATING;
        }
    }
    
    enableCollisions( mesh, size ) {
        
        if ( size == this.#planet.config.min ) {

            PhysicsEntity.collidable( mesh );
        }
    }

    #getDiffrence( position ) {

        return position.subtract( this.#planet.position );
    }

    #upToDisplaced( up ) {

        const inPlanetRotation = up.rotateByQuaternionToRef( this.#planet.rotationQuaternion.invert(), BABYLON.Vector3.Zero() );

        return PlanetUtils.displace( this.#planet, inPlanetRotation ).rotateByQuaternionToRef( this.#planet.rotationQuaternion, BABYLON.Vector3.Zero() );
    }

}