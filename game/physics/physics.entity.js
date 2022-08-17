"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PhysicsEntity {

    static TYPES = {

        STATIC: 0,
        DYNAMIC: 1
    };

    static STATES = {

        FLOATING: 0,
        GROUND: 1
    };
    
    static collidable( mesh, type ) {

        mesh.checkCollisions = true;
        mesh.physicsEntityType = type;
    }

    type = undefined;
    state = PhysicsEntity.STATES.FLOATING;

    delta = new BABYLON.Vector3( 0, 0, 0 );

    #mesh = null;

    constructor( mesh, type ) {

        this.#mesh = mesh;

        this.type = type;

        PhysicsEntity.collidable( this.#mesh, this.type );

        this.#bindObservables();
    }
    
    get position() {
        
        return this.#mesh.position;
    }

    get rotationQuaternion() {
        
        return this.#mesh.rotationQuaternion;
    }

    update() {

        if ( this.delta.x != 0 || this.delta.y != 0 || this.delta.z != 0 ) {

            this.state = PhysicsEntity.STATES.FLOATING;

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

    #bindObservables() {

        if ( this.type == PhysicsEntity.TYPES.DYNAMIC ) {

            this.#mesh.onCollideObservable.add( ( otherMesh ) => this.#onCollide( otherMesh ) );
        }
    }

    #onCollide( otherMesh ) {

        if ( otherMesh.physicsEntityType == PhysicsEntity.TYPES.STATIC ) {

            this.state = PhysicsEntity.STATES.GROUND;
        }
    }

}