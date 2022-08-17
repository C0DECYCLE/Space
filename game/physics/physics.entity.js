"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PhysicsEntity {

    static STATES = {

        FLOATING: 0,
        PLANETGROUND: 1
    }

    state = PhysicsEntity.STATES.FLOATING;
    delta = new BABYLON.Vector3( 0, 0, 0 );

    #mesh = null;

    constructor( mesh ) {

        this.#mesh = mesh;

        PhysicsEntity.collidable( this.#mesh );
    }

    static collidable( mesh ) {

        mesh.checkCollisions = true;
    }

    update() {

        if ( this.delta.x != 0 || this.delta.y != 0 || this.delta.z != 0 ) {

            this.#mesh.moveWithCollisions( this.delta );
        }

        this.delta.copyFromFloats( 0, 0, 0 );
    }

    getCollider() {

        if ( !this.#mesh.collider ) {

            this.#mesh.moveWithCollisions( BABYLON.Vector3.Zero() );
        }

        return this.#mesh.collider;
    }

    quaternionTowardsUpright( up, stretch ) {

        const look = BABYLON.Quaternion.FromLookDirectionRH( this.#mesh.forward, up );

        this.#mesh.rotationQuaternion.copyFrom( BABYLON.Quaternion.Slerp( this.#mesh.rotationQuaternion, look, stretch ) );
    }

}