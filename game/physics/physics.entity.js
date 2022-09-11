"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PhysicsEntity {

    static COLLIDER_SCALE = 0.8;

    static TYPES = {

        STATIC: 0,
        DYNAMIC: 1
    };

    static STATES = {

        FLOATING: 0,
        GROUND: 1
    };
    
    static collidable( mesh, type = PhysicsEntity.TYPES.STATIC ) {

        mesh.physicsEntityType = type;
        
        PhysicsEntity.#collisions( mesh, true );
    }

    static #collisions( mesh, checkCollisions ) {
        
        if ( mesh.collisionMesh !== undefined ) {

            mesh.collisionMesh.checkCollisions = checkCollisions;

            return;
        }

        mesh.checkCollisions = checkCollisions;
    }

    delta = new BABYLON.Vector3( 0, 0, 0 );
    velocity = new BABYLON.Vector3( 0, 0, 0 );

    #game = null;
    #mesh = null;
    #scene = null;
    #debugMesh = null;
    
    #typeValue = undefined;
    #stateValue = PhysicsEntity.STATES.FLOATING;

    #lastTimeOnGround = 0;
    #isPaused = false;
    #isCollidingPaused = false;
    #colliderMin = undefined;

    constructor( game, mesh, type = PhysicsEntity.TYPES.DYNAMIC ) {

        this.#game = game;
        this.#mesh = mesh;
        this.#scene = this.#game.scene;

        this.#typeValue = type;

        PhysicsEntity.collidable( this.#mesh, this.type );

        this.#setupFitCollider();
        this.#setupDebug();
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
        
        this.preUpdate();
        this.postUpdate();
    }

    preUpdate() {
        
        if ( this.#isPaused === true || this.#game.physics.isPaused === true ) {

            return;
        }

        this.#updateFitCollider();
    }

    postUpdate() {

        if ( this.#isPaused === true || this.#game.physics.isPaused === true ) {

            return;
        }

        if ( this.velocity.x !== 0 || this.velocity.y !== 0 || this.velocity.z !== 0 ) {

            this.delta.addInPlace( this.velocity );
        }

        if ( this.delta.x !== 0 || this.delta.y !== 0 || this.delta.z !== 0 ) {

            if ( this.#isCollidingPaused === false ) {

                PhysicsEntity.#collisions( this.#mesh, false );
                this.#mesh.moveWithCollisions( this.delta );
                PhysicsEntity.#collisions( this.#mesh, true );

            } else {

                this.#mesh.position.addInPlace( this.delta );
            }
        }

        this.delta.copyFromFloats( 0, 0, 0 );
        this.#updateDebug();
    }

    pause( allowCollisions = false, allowUpdate = false ) {

        this.#isPaused = !allowUpdate;
        this.#isCollidingPaused = !allowCollisions;
        PhysicsEntity.#collisions( this.#mesh, allowCollisions );
    }

    resume() {

        PhysicsEntity.#collisions( this.#mesh, true );
        this.#isCollidingPaused = false;
        this.#isPaused = false;
    }

    registerPull( distanceAboveGround ) {
        
        this.#lastTimeOnGround++;
        
        if ( distanceAboveGround - this.getColliderMax() < 0 ) {

            this.state = PhysicsEntity.STATES.GROUND;

        } else {

            this.state = PhysicsEntity.STATES.FLOATING;
        }
    }

    getAcceleration() {

        return this.#lastTimeOnGround / 100;
    }

    getColliderMax() {

        return this.#mesh.ellipsoid.max + this.#mesh.ellipsoidOffset.biggest;
    }

    getColliderMin() {

        return this.#colliderMin;
    }

    getColliderSize() {

        return this.#mesh.ellipsoid;
    }

    setColliderSize( size ) {

        this.#mesh.ellipsoid.copyFrom( size );
        
        EngineUtils.minmax( this.#mesh.ellipsoid );
    }

    #setupFitCollider() {
        
        this.#fitCollider();
        this.#colliderMin = this.#mesh.ellipsoid.min;
    }
    
    #fitCollider() {

        const boundingInfo = this.#mesh.collisionMesh !== undefined ? this.#mesh.collisionMesh.getBoundingInfo() : this.#mesh.getBoundingInfo();

        this.#mesh.ellipsoid.copyFrom( boundingInfo.boundingBox.extendSizeWorld ).scaleInPlace( PhysicsEntity.COLLIDER_SCALE );
        this.#mesh.ellipsoidOffset.copyFrom( boundingInfo.boundingBox.center ).applyRotationQuaternionInPlace( this.#mesh.rotationQuaternion ).multiplyInPlace( this.#mesh.scaling );

        EngineUtils.minmax( this.#mesh.ellipsoid );
        EngineUtils.minmax( this.#mesh.ellipsoidOffset );
    }

    #updateFitCollider() {

        this.#fitCollider();
    }

    #setupDebug( mesh = this.#mesh ) {

        this.#debugMesh = BABYLON.MeshBuilder.CreateSphere( "debugMesh", { diameter: 1, segments: 8 }, this.#scene );
        this.#debugMesh.material = this.#scene.debugMaterial;
        this.#updateDebug( mesh );
        
        if ( mesh.collisionMesh !== undefined ) {

            mesh.collisionMesh.isVisible = true;
        }
    }

    #updateDebug( mesh = this.#mesh ) {

        if ( this.#debugMesh !== null ) {
            
            this.#debugMesh.position.copyFrom( mesh.position ).addInPlace( mesh.ellipsoidOffset );
            this.#debugMesh.scaling.copyFrom( mesh.ellipsoid ).scaleInPlace( 2 );
        }
    }

}