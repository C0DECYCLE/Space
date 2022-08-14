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

    parent = null;

    state = PhysicsEntity.STATES.FLOATING;

    constructor( parent ) {

        this.parent = parent;
    }

    quaternionTowardsUpright( up, stretch ) {

        let look = BABYLON.Quaternion.FromLookDirectionRH( this.parent.root.forward, up );

        this.parent.root.rotationQuaternion.copyFrom( BABYLON.Quaternion.Slerp( this.parent.root.rotationQuaternion, look, stretch ) );
        this.parent.root.physicsImpostor.setAngularVelocity( BABYLON.Vector3.Zero() );
    }
    
}