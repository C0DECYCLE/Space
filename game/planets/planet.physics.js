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

        const up = this.#getDiffrence( physicsEntity.position ).normalize();
        const deltaCorrection = Space.engine.deltaCorrection;

        physicsEntity.delta.addInPlace( up.scale( -this.#planet.config.gravity * 0.1 * deltaCorrection ) );

        return up;
    }

    #getDiffrence( position ) {

        return position.subtract( this.#planet.position );
    }

}