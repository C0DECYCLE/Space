"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipThrusters {

    list = [];

    #spaceship = null;

    constructor( spaceship, config ) {

        this.#spaceship = spaceship;

        this.#setupThrusters( config );
    }

    update() {
        
        const thrust = this.#spaceship.physics.thrust * 20;

        for ( let i = 0; i < this.list.length; i++ ) {

            this.#updateThruster( this.list[i], thrust );
        }
    }

    #setupThrusters( config ) {

        for ( let i = 0; i < config.length; i++ ) {

            this.#setupThruster( config[i] );
        }
    }

    #setupThruster( config ) {

        const thruster = new BABYLON.GPUParticleSystem( `particles_thruster_${ this.#spaceship.root.name }`, { capacity: 400 }, this.#spaceship.game.scene );
        thruster.particleTexture = new BABYLON.Texture( "assets/textures/quad-particle.png", this.#spaceship.game.scene );
        thruster.emitter = this.#spaceship.root;
        thruster.config = config;
        
        thruster.minEmitBox = new BABYLON.Vector3( -0.1, -0.8, -0.4 );  
        thruster.maxEmitBox = new BABYLON.Vector3( 0.1, 0.8, 0.4 );

        thruster.minSize = 0.2;
        thruster.maxSize = 0.6;
        
        thruster.minLifeTime = 0.1;
        thruster.maxLifeTime = 1.0;

        thruster.minEmitPower = 0.1;

        thruster.minAngularSpeed = Math.PI;
        thruster.maxAngularSpeed = Math.PI * 2.0;
        thruster.minInitialRotation = 0;
        thruster.maxInitialRotation = Math.PI / 2;

        thruster.direction1 = new BABYLON.Vector3( 0, 0, -1 );
        thruster.direction2 = new BABYLON.Vector3( 0, 0, -1 );

        thruster.color1 = BABYLON.Color4.FromHexString( "#5683d6" );
        thruster.color2 = BABYLON.Color4.FromHexString( "#5683d6" );
        thruster.colorDead = BABYLON.Color4.FromHexString( "#201550" );

        thruster.emitRate = 40;
        thruster.start();

        this.list.push( thruster );
    }

    #updateThruster( thruster, thrust ) {
        
        thruster.isLocal = this.#spaceship.hasController === false;
        thruster.worldOffset.copyFrom( thruster.config ).applyRotationQuaternionInPlace( this.#spaceship.rotationQuaternion );

        thruster.minEmitPower = 0.1 * thrust;
        thruster.maxEmitPower = 0.4 * thrust;

        thruster.updateSpeed = 0.02 + thrust * 0.003;
    }

}