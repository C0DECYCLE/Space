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

    #parent = null;

    constructor( parent ) {

        this.#parent = parent;

        this.#enableCollisions();
    }

    quaternionTowardsUpright( up, stretch ) {

        let look = BABYLON.Quaternion.FromLookDirectionRH( this.#parent.root.forward, up );

        this.#parent.root.rotationQuaternion.copyFrom( BABYLON.Quaternion.Slerp( this.#parent.root.rotationQuaternion, look, stretch ) );
    }
    
    #enableCollisions() {
        
        this.#parent.root.checkCollisions = true;
    }

}