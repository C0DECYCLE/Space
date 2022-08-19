"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PhysicsEntity {

    static ENLARGEMENT = ( 1 + ( 1 / Math.sin( Math.PI / 4 ) ) ) / 2;

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

    #scene = null;
    #mesh = null;

    constructor( mesh, type ) {

        this.#mesh = mesh;
        this.#scene = this.#mesh.getScene();

        this.type = type;

        PhysicsEntity.collidable( this.#mesh, this.type );

        this.#bindObservables();
        this.#fitCollider();

        //this.debugCollider();
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

    debugCollider() {

        const ellipsoid = this.#mesh.ellipsoid;

        const debug = BABYLON.MeshBuilder.CreateSphere( `${ this.#mesh.name }_debug_collider`, { diameterX: ellipsoid.x * 2, diameterY: ellipsoid.y * 2, diameterZ: ellipsoid.z * 2, segments: 8 }, this.#scene );
        debug.position.copyFrom( this.#mesh.ellipsoidOffset );
        debug.material = this.#scene.debugMaterial;
        debug.parent = this.#mesh;
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

    #fitCollider() {

        const info = this.#mesh.getBoundingInfo();

        this.#mesh.ellipsoid
        .copyFrom( info.boundingSphere.maximum )
        .scaleInPlace( PhysicsEntity.ENLARGEMENT );
    }

    #onCollide( otherMesh ) {

        if ( otherMesh.physicsEntityType == PhysicsEntity.TYPES.STATIC ) {

            this.state = PhysicsEntity.STATES.GROUND;
        }
    }

}