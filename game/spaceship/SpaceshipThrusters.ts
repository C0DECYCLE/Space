/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipThrusters implements ISpaceshipThrusters {

    public readonly spaceship: IAbstractSpaceship;
    public readonly list: [ BABYLON.GPUParticleSystem, IConfig ][] = [];

    private isPaused: boolean = false;

    public constructor( spaceship: IAbstractSpaceship, config: IConfig ) {

        this.spaceship = spaceship;

        this.setupThrusters( config );
    }

    public update(): void {
        
        if ( this.spaceship.lod.isVisible === false ) {

            this.pause();

            return;
        }
        
        this.resume();

        const thrust: number = this.spaceship.physics.thrust * 20;

        for ( let i: number = 0; i < this.list.length; i++ ) {

            this.updateThruster( this.list[i], thrust );
        }
    }

    private setupThrusters( config: IConfig ): void {

        for ( let i: number = 0; i < config.length; i++ ) {

            this.list.push( [ this.setupThruster(), config[i] ] );
        }
    }

    private setupThruster(): BABYLON.GPUParticleSystem {

        const thruster: BABYLON.GPUParticleSystem = new BABYLON.GPUParticleSystem( `particles_thruster_${ this.spaceship.root.name }`, { capacity: 400 }, scene );
        thruster.particleTexture = new BABYLON.Texture( "assets/textures/quad-particle.png", scene );
        thruster.emitter = ( this.spaceship.root instanceof BABYLON.AbstractMesh ) ? this.spaceship.root : this.spaceship.position;
        
        thruster.minEmitBox = new BABYLON.Vector3( -0.5, -0.8, -0.1 );  
        thruster.maxEmitBox = new BABYLON.Vector3( 0.5, 0.8, 0.1 );

        thruster.minSize = 0.2;
        thruster.maxSize = 0.6;
        
        thruster.minLifeTime = 0.2;
        thruster.maxLifeTime = 0.8;

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

        return thruster;
    }

    private updateThruster( thruster: [ BABYLON.GPUParticleSystem, IConfig ], thrust: number ): void {
        
        thruster[0].isLocal = this.spaceship.hasController === false;
        
        if ( thruster[1] instanceof BABYLON.Vector3 ) {

            thruster[0].worldOffset.copyFrom( thruster[1] ).applyRotationQuaternionInPlace( this.spaceship.rotationQuaternion );
        }

        thruster[0].minEmitPower = 0.1 * thrust;
        thruster[0].maxEmitPower = 0.4 * thrust;

        thruster[0].updateSpeed = 0.02 + thrust * 0.003;
    }

    private pause(): void {

        if ( this.isPaused === false ) {

            for ( let i: number = 0; i < this.list.length; i++ ) {

                this.list[i][0].stop();
            }
            
            this.isPaused = true;
        }
    }

    private resume(): void {

        if ( this.isPaused === true ) {

            for ( let i: number = 0; i < this.list.length; i++ ) {

                this.list[i][0].start();
            }

            this.isPaused = false;
        }
    }

}