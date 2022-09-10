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

    #debugMesh = null;

    constructor( game, mesh, type = PhysicsEntity.TYPES.DYNAMIC ) {

        this.#game = game;
        this.#mesh = mesh;
        this.#scene = this.#game.scene;

        this.#typeValue = type;

        PhysicsEntity.collidable( this.#mesh, this.type );

        this.#fitCollider();
        this.#debug();
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

        //this.#fitCollider();
        //this.#debug();

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

        if ( distanceAboveGround - this.#mesh.ellipsoid.y + this.#mesh.ellipsoidOffset.y < 0 ) {

            this.state = PhysicsEntity.STATES.GROUND;

        } else {

            this.state = PhysicsEntity.STATES.FLOATING;
        }
    }

    getAcceleration() {

        return this.#lastTimeOnGround / 100;
    }

    #fitCollider() {

        //not use this use getBoundingInfo With CollisionMesh
        const bounding = EngineUtils.getBounding( this.#mesh, true, mesh => mesh.name !== "debugMesh" );
        
        this.#mesh.ellipsoid
        .copyFrom( bounding.scaleInPlace( 0.5 ) );
        
        this.#mesh.ellipsoidOffset
        .copyFrom( bounding.offset );
    }

    #debug( mesh = this.#mesh ) {

        if ( this.#debugMesh !== null ) {
            
            this.#debugMesh.position.copyFrom( mesh.ellipsoidOffset );
            this.#debugMesh.rotationQuaternion.copyFrom( mesh.rotationQuaternion ).invertInPlace();
            this.#debugMesh.scaling.copyFrom( mesh.ellipsoid ).scaleInPlace( 2 ).divideInPlace( mesh.scaling );

            return;
        }

        const debug = BABYLON.MeshBuilder.CreateSphere( "debugMesh", { diameter: 1, segments: 8 }, this.#scene );
        debug.position.copyFrom( mesh.ellipsoidOffset );
        debug.rotationQuaternion = mesh.rotationQuaternion.invert();
        debug.scaling.copyFrom( mesh.ellipsoid ).scaleInPlace( 2 ).divideInPlace( mesh.scaling );
        debug.material = this.#scene.debugMaterial;
        debug.parent = mesh;

        this.#debugMesh = debug;
    }

}