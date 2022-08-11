"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerPhysics extends PhysicsEntity {

    #planet = null;

    constructor( parent ) {

        super( parent/*, true*/ );
        
        this.#addPhysics();

        //this.register();
    }

    setPlanet( value ) {

        this.#planet = value;
    }

    space() {

        this.#spaceMovement();
    }

    planet() {

        if ( this.#planet != null ) {
            
            //this.update();
            this.#planet.physics.pullPhysicsEntity( this.parent, true/*, true*/ );
            this.#planet.physics.collideHeightmap( this.parent );
            //this.#planet.physics.collideGroundBox( this.parent );

            if ( this.state != PhysicsEntity.STATES.FLOATING ) {
                
                this.#planetMovement();
            }

        } else {

            console.error( "Planet Gravity: Planet is null!" );
        }
    }

    #addPhysics() {

        this.parent.mesh.physicsImpostor = new BABYLON.PhysicsImpostor( this.parent.mesh, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0 }, this.parent.scene );
        this.parent.root.physicsImpostor = new BABYLON.PhysicsImpostor( this.parent.root, BABYLON.PhysicsImpostor.NoImpostor, { mass: 4, friction: 0.9, restitution: 0.1 }, this.parent.scene );
        //this.parent.root.neverPhysicsSleep = true;
    }

    #spaceMovement() {

        let controls = this.parent.controls;
        let speed = this.parent.config.speed;
        let translate = new BABYLON.Vector3( 0, 0, 0 );

        if ( controls.activeKeys.has( "w" ) == true ) {

            translate.z = speed;

        } else if ( controls.activeKeys.has( "s" ) == true ) {

            translate.z = -speed;
        }
        
        if ( controls.activeKeys.has( "d" ) == true ) {

            translate.x = speed;

        } else if ( controls.activeKeys.has( "a" ) == true ) {

            translate.x = -speed;
        }
        
        if ( controls.activeKeys.has( "q" ) == true ) {

            translate.y = speed;

        } else if ( controls.activeKeys.has( "e" ) == true ) {

            translate.y = -speed;
        }

        this.#movementTranslate( translate );
    }

    #planetMovement() {

        let controls = this.parent.controls;
        let speed = this.parent.config.speed;
        let translate = new BABYLON.Vector3( 0, 0, 0 );

        if ( controls.activeKeys.has( "w" ) == true ) {

            translate.z = speed;

        } else if ( controls.activeKeys.has( "s" ) == true ) {

            translate.z = -speed;
        }
        
        if ( controls.activeKeys.has( "d" ) == true ) {

            translate.x = speed;

        } else if ( controls.activeKeys.has( "a" ) == true ) {

            translate.x = -speed;
        }

        this.#movementTranslate( translate );
    }

    #movementTranslate( translate ) {

        let root = this.parent.root;

        if ( translate.x != 0 || translate.y != 0 || translate.z != 0 ) {

            root.physicsImpostor.applyImpulse( translate.applyRotationQuaternion( root.rotationQuaternion ), BABYLON.Vector3.Zero() );

        } else {
            
            root.physicsImpostor.applyImpulse( root.physicsImpostor.getLinearVelocity().scaleInPlace( -0.01 ), BABYLON.Vector3.Zero() );
        }
    }
}