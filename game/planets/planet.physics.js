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

    enable( mesh, size ) {
        
        if ( size == this.#planet.config.min ) {

            PhysicsEntity.collidable( mesh, PhysicsEntity.TYPES.STATIC );
        }
    }

    pull( physicsEntity ) {

        const up = this.#getDelta( physicsEntity.position ).normalize();
        const distance = BABYLON.Vector3.Distance( this.#projectOnSurface( up ), physicsEntity.position );

        this.#pullSpin( physicsEntity, distance );
        this.#pullGravity( physicsEntity, up, distance );
        
        return up;
    }

    #getDelta( position ) {

        return position.subtract( this.#planet.position );
    }

    #projectOnSurface( up ) {

        const noise = PlanetUtils.noise( this.#planet, up.rotateByQuaternionToRef( this.#planet.rotationQuaternion.invert(), BABYLON.Vector3.Zero() ) );

        return up.clone().scaleInPlace( this.#planet.config.radius + noise ).addInPlace( this.#planet.position );
    }

    #pullSpin( physicsEntity, distance ) {

        if ( this.#planet.config.spin != false ) {

            const deltaCorrection = Space.engine.deltaCorrection;
            const deltaAngle = this.#planet.config.spin * EngineUtils.toRadian * deltaCorrection * this.#getSpinFactor( distance );

            physicsEntity.delta.addInPlace( 
                physicsEntity.position
                .rotateByQuaternionAroundPointToRef( this.#deltaAngleToQuaternion( deltaAngle ), this.#planet.position.clone(), BABYLON.Vector3.Zero() )
                .subtractInPlace( physicsEntity.position )
            );
        }
    }

    #getSpinFactor( distance ) {

        return Math.sqrt( 1 / distance ).clamp( 0, 1 )
    }

    #deltaAngleToQuaternion( deltaAngle ) {

        return BABYLON.Quaternion.FromEulerVector( BABYLON.Vector3.Up().scaleInPlace( deltaAngle ) );
    }

    #pullGravity( physicsEntity, up, distance ) {

        if ( distance > physicsEntity.getCollider().length() ) {

            const deltaCorrection = Space.engine.deltaCorrection;
            
            physicsEntity.delta.addInPlace( up.scale( -this.#planet.config.gravity * 0.1 * deltaCorrection ) );

        } else {

            physicsEntity.state = PhysicsEntity.STATES.GROUND;
        }
    }

}