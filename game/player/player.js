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
    camera = null;
    root = null;
    mesh = null;
    controls = null;

    state = new StateMachine();

    #planet = null;

    constructor( scene, config, camera, controls ) {

        this.scene = scene;
        this.camera = camera;
        this.controls = controls;

        this.config.speed = config.speed || this.config.speed;

        //this.root = new BABYLON.Mesh( "player", this.scene );
        //this.root.rotationQuaternion = this.root.rotation.toQuaternion();

        this.state.add( "space", ( oldState ) => this.#onSpaceEnter( oldState ), ( newState ) => this.#onSpaceLeave( newState ) );
        this.state.add( "planet",( oldState, planet ) => this.#onPlanetEnter( oldState, planet ), ( newState ) => this.#onPlanetLeave( newState ) );

        this.#createMesh();      
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();          


                this.root.physicsImpostor = new BABYLON.PhysicsImpostor( this.root, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, this.scene );
                //this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor( this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1 }, this.scene );
                physicsViewer.showImpostor( this.root.physicsImpostor );


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

        this.root.position.addInPlace( translate.applyRotationQuaternion( this.root.rotationQuaternion ) );
    }

    #planetGravity() {

        if ( this.#planet != null ) {
            
            
        } else {

            console.error( "Planet Gravity: Planet is null!" );
        }
    }

    #onPointerMove( event ) {
    
        if ( this.controls.isPointerDown == true ) {

            if ( this.controls.isKeyboarding == true ) {

                this.root.rotate( BABYLON.Axis.Y, event.event.movementX * this.controls.config.panning, BABYLON.Space.LOCAL );
                this.root.rotate( BABYLON.Axis.X, event.event.movementY * this.controls.config.panning, BABYLON.Space.LOCAL );
    
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

        this.root = BABYLON.MeshBuilder.CreateCapsule( "player_mesh", { height: 2, radius: 0.5, tessellation: 8, subdivisions: 1, capSubdivisions: 3 }, this.scene );
        this.root.material = material;
        this.root.convertToFlatShadedMesh();
        //this.mesh.parent = this.root;
        
        let head = BABYLON.MeshBuilder.CreateBox( "player_mesh_head", { width: 0.7, height: 0.35, depth: 0.3 }, this.scene );
        head.position.copyFromFloats( 0, 0.5, 0.4 );
        head.material = material;
        head.convertToFlatShadedMesh();
        head.parent = this.root;
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


                /*
                let forceDirection = this.#planet.root.position.subtract( this.root.position ).normalize();
                let forceMagnitude = 5000;
                let contactPoint = this.root.position.add( new BABYLON.Vector3( 0, 0.1, 0 ) );
                
                this.root.physicsImpostor.applyForce( forceDirection.scaleInPlace( forceMagnitude ), contactPoint );
                */
    }
    
    #onPlanetLeave( newState ) {
        
        log( "player left planet" );

        this.#planet = null;
    }

}