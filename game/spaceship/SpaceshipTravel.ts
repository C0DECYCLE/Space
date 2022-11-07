/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipTravel implements ISpaceshipTravel {
    
    public readonly spaceship: ISpaceship;

    private system: BABYLON.GPUParticleSystem;
    private isStarted: boolean = false;

    //private minEmitPower_c: number;
    //private maxEmitPower_c: number;
    //private emitRate_c: number;

    public constructor( spaceship: ISpaceship ) {

        this.spaceship = spaceship;

        this.setupSystem();
    }

    public update(): void {
        
        if ( this.spaceship.physics.travel.isJumping === true ) {

            this.start();

        } else {

            this.stop();
        }
    }

    private setupSystem(): void {

        this.system = new BABYLON.GPUParticleSystem( `particles_travel_${ this.spaceship.root.name }`, { capacity: 20 * 1000 }, scene );
        this.system.particleTexture = new BABYLON.Texture( "assets/textures/quad-particle.png", scene );
        this.system.emitter = ( this.spaceship.root instanceof BABYLON.AbstractMesh ) ? this.spaceship.root : this.spaceship.position;
        this.system.isLocal = false;

        this.system.minSize = 0.2;
        this.system.maxSize = 0.4;
        
        this.system.minLifeTime = 8;
        this.system.maxLifeTime = 12;

        //this.minEmitPower_c = 10;
        this.system.minEmitPower = 10;
        //this.maxEmitPower_c = 15;
        this.system.maxEmitPower = 15;

        this.system.minAngularSpeed = 0;
        this.system.maxAngularSpeed = Math.PI / 2.0;
        this.system.minInitialRotation = 0;
        this.system.maxInitialRotation = Math.PI / 2;

        this.system.color1 = BABYLON.Color4.FromHexString( "#add1df" );
        this.system.color2 = BABYLON.Color4.FromHexString( "#6c447c" );
        this.system.colorDead = BABYLON.Color4.FromHexString( "#2b2146" );

        const sphereEmitter = this.system.createDirectedSphereEmitter();

        sphereEmitter.radius = EngineUtils.getBoundingSize( this.spaceship.root ) * 10.0;
        sphereEmitter.radiusRange = 0.2;
        
        sphereEmitter.direction1 = new BABYLON.Vector3( 0, 0, -1 );
        sphereEmitter.direction2 = new BABYLON.Vector3( 0, 0, -1 );

        //this.emitRate_c = 1 * 1000;
        this.system.emitRate = 1 * 1000;
        this.system.updateSpeed = 1.0;
    }

    private start(): void {

        if ( this.isStarted === false ) {

            this.system.reset();
            this.system.start();

            //this.system.emitRate = 0;
            //this.system.minEmitPower = 0;
            //this.system.maxEmitPower = 0;

            //new TWEEN.Tween( this.system ).to( { emitRate: this.system.emitRate_c, minEmitPower: this.system.minEmitPower_c, maxEmitPower: this.system.maxEmitPower_c }, 500 ).start();

            this.isStarted = true;
        }
    }

    private stop(): void {

        if ( this.isStarted === true ) {

            //new TWEEN.Tween( this.system ).to( { emitRate: 0, minEmitPower: 0, maxEmitPower: 0 }, 0 ).onComplete( () => {
                
                this.system.stop();
                this.system.reset();

            //} ).start();

            this.isStarted = false;
        }
    }

}