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
    
    static collidable( mesh, type = PhysicsEntity.TYPES.STATIC, children = true ) {

        mesh.physicsEntityType = type;
        mesh.physicsEntityCollidableChildren = children;
        
        PhysicsEntity.#collisions( mesh, true );
    }

    static #collisions( mesh, checkCollisions ) {

        mesh.checkCollisions = checkCollisions;

        if ( mesh.physicsEntityCollidableChildren === true ) {

            const subs = mesh.getChildMeshes();
            
            for ( let i = 0; i < subs.length; i++ ) {

                subs[i].checkCollisions = checkCollisions;
            }
        }
    }

    delta = new BABYLON.Vector3( 0, 0, 0 );
    velocity = new BABYLON.Vector3( 0, 0, 0 );

    #game = null;
    #mesh = null;
    #scene = null;
    
    #typeValue = undefined;
    #stateValue = PhysicsEntity.STATES.FLOATING;

    #lastTimeOnGround = 0;
    #isPaused = false;
    #isCollidingPaused = false;

    constructor( game, mesh, type = PhysicsEntity.TYPES.DYNAMIC, customCollider = false ) {

        this.#game = game;
        this.#mesh = mesh;
        this.#scene = this.#game.scene;

        this.#typeValue = type;

        PhysicsEntity.collidable( this.#mesh, this.type );

        this.#fitCollider( customCollider );
        this.debugCollider();
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
        
        if ( this.#isPaused === true || this.#game.physics.isPaused === true ) {

            return;
        }

        if ( this.velocity.x !== 0 || this.velocity.y !== 0 || this.velocity.z !== 0 ) {

            this.delta.addInPlace( this.velocity );
        }

        if ( this.delta.x !== 0 || this.delta.y !== 0 || this.delta.z !== 0 ) {

            PhysicsEntity.#collisions( this.#mesh, false );
            
            if ( this.#isCollidingPaused === false ) {

                this.#mesh.moveWithCollisions( this.delta );

            } else {

                this.#mesh.position.addInPlace( this.delta );
            }

            PhysicsEntity.#collisions( this.#mesh, true );
        }

        this.delta.copyFromFloats( 0, 0, 0 );
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

    debugCollider( mesh = this.#mesh ) {

        const debug = BABYLON.MeshBuilder.CreateSphere( "collider_debug", { diameterX: mesh.ellipsoid.x * 2, diameterY: mesh.ellipsoid.y * 2, diameterZ: mesh.ellipsoid.z * 2, segments: 8 }, this.#scene );
        debug.position.copyFrom( mesh.ellipsoidOffset );
        debug.scaling.divideInPlace( mesh.scaling );
        debug.material = this.#scene.debugMaterial;
        debug.parent = mesh;
    }

    registerPull( distanceAboveGround ) {
        
        this.#lastTimeOnGround++;

        if ( distanceAboveGround - this.#mesh.ellipsoid.y + this.#mesh.ellipsoidOffset.y < 0 ) {

            this.state = PhysicsEntity.STATES.GROUND;

        } else {

            this.state = PhysicsEntity.STATES.FLOATING;
        }
    }

    getAcceleration() {

        return this.#lastTimeOnGround / 100;
    }

    #fitCollider( customCollider = false ) {

        const bounding = EngineUtils.getBounding( this.#mesh );
        
        this.#mesh.ellipsoid
        .copyFrom( customCollider === false ? bounding.scaleInPlace( 0.5 ) : customCollider );
        
        this.#mesh.ellipsoidOffset
        .copyFrom( bounding.offset );
    }

}