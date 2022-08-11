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

    parent = null;

    //box = null;

    state = PhysicsEntity.STATES.FLOATING;

    //#boxCollided = false;

    constructor( parent/*, manualRegister = false*/ ) {

        this.parent = parent;

        this.#createBox();
        /*
        if ( manualRegister == false ) {

            this.register();
        }*/
    }

    quaternionTowardsUpright( up, stretch ) {

        let look = BABYLON.Quaternion.FromLookDirectionRH( this.parent.root.forward, up );

        this.parent.root.rotationQuaternion.copyFrom( BABYLON.Quaternion.Slerp( this.parent.root.rotationQuaternion, look, stretch ) );
        this.parent.root.physicsImpostor.setAngularVelocity( BABYLON.Vector3.Zero() );
    }
    /*
    register() {

        this.parent.root.physicsImpostor.registerOnPhysicsCollide( this.box.physicsImpostor, () => {

            this.#boxCollided = true;
        } );
    }

    update() {

        if ( this.#boxCollided == true ) {

            this.state = PhysicsEntity.STATES.PLANETGROUND;
            this.#boxCollided = false;

        } else {

            this.state = PhysicsEntity.STATES.FLOATING;
        }
    }
    */
    #createBox() {

        this.box = BABYLON.MeshBuilder.CreateBox( "physics_entity_box", { width: 5, height: 0.05, depth: 5 }, this.parent.scene );
        this.box.position.copyFrom( EngineUtils.getFarAway() );
        this.box.rotationQuaternion = this.box.rotation.toQuaternion();
        this.box.visibility = 0;
        this.box.physicsImpostor = new BABYLON.PhysicsImpostor( this.box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.9, restitution: 0.1 }, this.parent.scene ); 
    }

}