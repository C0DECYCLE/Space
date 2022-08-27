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

    delta = new BABYLON.Vector3( 0, 0, 0 );
    velocity = new BABYLON.Vector3( 0, 0, 0 );

    #scene = null;
    #mesh = null;
    
    #typeValue = undefined;
    #stateValue = PhysicsEntity.STATES.FLOATING;

    #lastTimeOnGround = 0;
    #isPaused = false;

    constructor( mesh, type ) {

        this.#mesh = mesh;
        this.#scene = this.#mesh.getScene();

        this.#type = type;

        PhysicsEntity.collidable( this.#mesh, this.type );

        //this.#bindObservables();
        this.#fitCollider();

        //this.debugCollider();
    }
    
    get position() {
        
        return this.#mesh.position;
    }

    get rotationQuaternion() {
        
        return this.#mesh.rotationQuaternion;
    }

    get type() {

        return this.#typeValue;
    }

    set #type( value ) {

        this.#typeValue = value;
    }

    get state() {

        return this.#stateValue;
    }

    set state( value ) {

        this.#stateValue = value;

        if ( this.#stateValue === PhysicsEntity.STATES.GROUND ) {

            this.#lastTimeOnGround = 0;
        }
    }

    update() {
        
        if ( this.#isPaused === true ) {

            return;
        }
        
        this.delta.addInPlace( this.velocity );

        if ( this.delta.x !== 0 || this.delta.y !== 0 || this.delta.z !== 0 ) {

            this.#mesh.moveWithCollisions( this.delta );
        }

        this.delta.copyFromFloats( 0, 0, 0 );
    }

    pause() {

        this.#isPaused = true;
        this.#mesh.checkCollisions = false;
    }

    resume() {

        this.#mesh.checkCollisions = true;
        this.#isPaused = false;
    }

    getCollider() {

        return this.#mesh.ellipsoid;
    }

    debugCollider() {

        const ellipsoid = this.getCollider();

        const debug = BABYLON.MeshBuilder.CreateSphere( `${ this.#mesh.name }_debug_collider`, { diameterX: ellipsoid.x * 2, diameterY: ellipsoid.y * 2, diameterZ: ellipsoid.z * 2, segments: 8 }, this.#scene );
        debug.position.copyFrom( this.#mesh.ellipsoidOffset );
        debug.scaling.divideInPlace( this.#mesh.scaling );
        debug.material = this.#scene.debugMaterial;
        debug.parent = this.#mesh;
        
        //star.manager.postprocess.register( dummy.root );
    }

    quaternionTowardsUpright( up, stretch ) {

        const look = BABYLON.Quaternion.FromLookDirectionRH( this.#mesh.forward, up );

        this.#mesh.rotationQuaternion.copyFrom( BABYLON.Quaternion.Slerp( this.#mesh.rotationQuaternion, look, stretch ) );
    }

    registerPull( distanceAboveGround ) {
        
        this.#lastTimeOnGround++;

        if ( distanceAboveGround < this.getCollider().y ) {

            this.state = PhysicsEntity.STATES.GROUND;

        } else {

            this.state = PhysicsEntity.STATES.FLOATING;
        }
    }

    getAcceleration() {

        return this.#lastTimeOnGround / 100;
    }

    #fitCollider() {

        const bounding = EngineUtils.getBounding( this.#mesh );
        
        this.getCollider()
        .copyFrom( bounding.scaleInPlace( 0.5 ) )
        .multiplyInPlace( this.#mesh.scaling )
        .scaleInPlace( PhysicsEntity.ENLARGEMENT );
    }

    #bindObservables() {

        if ( this.type === PhysicsEntity.TYPES.DYNAMIC ) {

            //this.#mesh.onCollideObservable.add( ( otherMesh ) => this.#onCollide( otherMesh ) );
        }
    }

    #onCollide( otherMesh ) {
        
        if ( otherMesh.physicsEntityType === PhysicsEntity.TYPES.STATIC ) {

        }
    }

}