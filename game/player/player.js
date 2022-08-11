"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Player {

    config = {

        speed: 0.1 // 0.15 run 0.05 walk
    };

    scene = null;
    physics = null;
    entity = null;
    mesh = null;
    camera = null;
    controls = null;

    state = new StateMachine();

    //velocity = new BABYLON.Vector3( 0, 0, 0 );

    #planet = null;

    constructor( scene, config, camera, controls, physics ) {

        this.scene = scene;
        this.physics = physics;
        this.camera = camera;
        this.controls = controls;

        this.config.speed = config.speed || this.config.speed;

        this.entity = new Entity( "player", this.scene, this.camera );

        this.state.add( "space", ( oldState ) => this.#onSpaceEnter( oldState ), ( newState ) => this.#onSpaceLeave( newState ) );
        this.state.add( "planet",( oldState, planet ) => this.#onPlanetEnter( oldState, planet ), ( newState ) => this.#onPlanetLeave( newState ) );

        this.#createMesh();


        this.entity.physicsBody = new CANNON.Body( {
            mass: 1, // kg
            position: new CANNON.Vec3( this.entity.originPosition.x, this.entity.originPosition.y, this.entity.originPosition.z ), // m
            shape: new CANNON.Sphere( 1 )
        } );
        this.physics.world.addBody( this.entity.physicsBody );


                //this.entity.physicsImpostor = new BABYLON.PhysicsImpostor( this.entity, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1, restitution: 0.5 }, this.scene );
                //physicsViewer.showImpostor( mesh.physicsImpostor, mesh );
                
        this.controls.onPointerMove.add( event => this.#onPointerMove( event ) );
    }

    update() {

        if ( this.state.is( "space" ) == true ) {

            this.#spaceMovement();

        } else if ( this.state.is( "planet" ) == true ) {

            //this.#planetGravity();
            //log("planet movement?");
        }
    }

    #spaceMovement() {

        let translate = new BABYLON.Vector3( 0, 0, 0 );

        if ( this.controls.activeKeys.has( "w" ) == true ) {

            translate.z = this.config.speed;

        } else if ( this.controls.activeKeys.has( "s" ) == true ) {

            translate.z = -this.config.speed;
        }
        
        if ( this.controls.activeKeys.has( "d" ) == true ) {

            translate.x = this.config.speed;

        } else if ( this.controls.activeKeys.has( "a" ) == true ) {

            translate.x = -this.config.speed;
        }
        
        if ( this.controls.activeKeys.has( "q" ) == true ) {

            translate.y = this.config.speed;

        } else if ( this.controls.activeKeys.has( "e" ) == true ) {

            translate.y = -this.config.speed;
        }

        this.entity.originPosition.addInPlace( translate.applyRotationQuaternion( this.entity.rotationQuaternion ) );
        this.entity.originManualUpdate = true;
    }

    #planetGravity() {

        if ( this.#planet != null ) {
            /*
            let gravityDirection = this.#planet.entity.originPosition.subtract( this.entity.originPosition );
            let length = gravityDirection.length();

            if ( length > this.#planet.config.radius * 1.05 ) {

                gravityDirection.normalizeFromLength( length ).scale( 0.25 );

                this.entity.originPosition.addInPlace( gravityDirection );
                this.entity.originManualUpdate = true;
            }
            */
        } else {

            console.error( "Planet Gravity: Planet is null!" );
        }
    }

    #onPointerMove( event ) {
    
        if ( this.controls.isPointerDown == true ) {

            if ( this.controls.isKeyboarding == true ) {

                    this.entity.rotate( BABYLON.Axis.Y, event.event.movementX * this.controls.config.panning, BABYLON.Space.LOCAL );
                    this.entity.rotate( BABYLON.Axis.X, event.event.movementY * this.controls.config.panning, BABYLON.Space.LOCAL );
        
            } else {

                    this.camera.free( event );
            }
        }
    }

    #createMesh() {

        let material = new BABYLON.StandardMaterial( "player_material", this.scene );
        material.diffuseColor = BABYLON.Color3.FromHexString("#ff226b");
        material.emissiveColor = BABYLON.Color3.FromHexString("#120B25");
        material.specularColor.set( 0, 0, 0 );

        this.mesh = BABYLON.MeshBuilder.CreateCapsule( "player_mesh", { height: 2, radius: 0.5, tessellation: 8, subdivisions: 1, capSubdivisions: 3 }, this.scene );
        this.mesh.material = material;
        this.mesh.convertToFlatShadedMesh();
        this.mesh.parent = this.entity;

        let head = BABYLON.MeshBuilder.CreateBox( "player_mesh_head", { width: 0.7, height: 0.35, depth: 0.3 }, this.scene );
        head.position.copyFromFloats( 0, 0.5, 0.4 );
        head.material = material;
        head.convertToFlatShadedMesh();
        head.parent = this.mesh;
    }

    #onSpaceEnter( oldState ) {

        log( "player entered space" );
    }

    #onSpaceLeave( newState ) {
        
        log( "player left space" );
    }
    
    #onPlanetEnter( oldState, planet ) {
        
        log( "player entered planet" );

        this.#planet = planet;


                let force = this.#planet.entity.originPosition.subtract( this.entity.originPosition ).normalize().scale( 500 );

                this.entity.physicsBody.force.set( force.x, force.y, force.z );

                /*
                let forceDirection = this.#planet.entity.originPosition.subtract( this.entity.originPosition ).normalize();
                let forceMagnitude = 50;
                let contactLocalRefPoint = BABYLON.Vector3.Zero();

                this.entity.physicsImpostor.applyForce( forceDirection.scale( forceMagnitude ), this.entity.position );
                */
    }
    
    #onPlanetLeave( newState ) {
        
        log( "player left planet" );

        this.#planet = null;
    }

}