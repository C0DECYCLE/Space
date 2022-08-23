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
        
        if ( size === this.#planet.config.min ) {

            PhysicsEntity.collidable( mesh, PhysicsEntity.TYPES.STATIC );
        }
    }

    pull( physicsEntity ) {

        const delta = this.#getDelta( physicsEntity.position );
        const distanceCenter = delta.length(); 
        const up = delta.clone().normalize();
        const distance = BABYLON.Vector3.Distance( this.#projectOnSurface( up ), physicsEntity.position );
        
        this.#pullSpin( physicsEntity, distanceCenter );
        this.#pullGravity( physicsEntity, up );
        
        physicsEntity.registerPull( distance );

        return up;
    }

    spin( physicsEntity ) {

        const delta = this.#getDelta( physicsEntity.position );
        const distanceCenter = delta.length(); 
        const up = delta.clone().normalize();

        this.#pullSpin( physicsEntity, distanceCenter );

        return up;
    }

    #getDelta( position ) {

        return position.subtract( this.#planet.position );
    }

    #projectOnSurface( up ) {

        const noise = PlanetUtils.noise( this.#planet, up.rotateByQuaternionToRef( this.#planet.rotationQuaternion.invert(), BABYLON.Vector3.Zero() ) );

        return up.clone().scaleInPlace( this.#planet.config.radius + noise ).addInPlace( this.#planet.position );
    }

    #pullSpin( physicsEntity, distanceCenter ) {

        if ( this.#planet.config.spin !== false ) {

            const deltaCorrection = Space.engine.deltaCorrection;
            const deltaAngle = this.#planet.config.spin * EngineUtils.toRadian * deltaCorrection * this.#getSpinFactor( distanceCenter );

            physicsEntity.delta.addInPlace( 
                physicsEntity.position
                .rotateByQuaternionAroundPointToRef( this.#deltaAngleToQuaternion( deltaAngle ), this.#planet.position.clone(), BABYLON.Vector3.Zero() )
                .subtractInPlace( physicsEntity.position )
            );
        }
    }

    #getSpinFactor( distanceCenter ) {

        const distanceAboveMaxHeight = distanceCenter - this.#planet.config.radius - this.#planet.config.maxHeight;
        const distanceBetweenMaxHeight = this.#planet.config.influence - this.#planet.config.maxHeight;

        return ( 1 - ( distanceAboveMaxHeight / distanceBetweenMaxHeight ) ).clamp( 0, 1 );
    }

    #deltaAngleToQuaternion( deltaAngle ) {

        return BABYLON.Quaternion.FromEulerVector( BABYLON.Vector3.Up().scaleInPlace( deltaAngle ) );
    }

    #pullGravity( physicsEntity, up ) {

        const deltaCorrection = Space.engine.deltaCorrection;
        const acceleration = physicsEntity.getAcceleration();
        
        physicsEntity.delta.addInPlace( up.scale( -this.#planet.config.gravity * 0.1 * acceleration * deltaCorrection ) );
    }

}