/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerPhysics extends PhysicsEntity implements IPlayerPhysics {

    public readonly player: IPlayer;

    public planet: Nullable< IPlanet >;
    public spaceship: Nullable< IAbstractSpaceship >;

    public constructor( player: IPlayer ) {

        super( player.root );
        
        this.player = player;
    }

    public override update(): void {
        
        if ( this.player.state.is( "space" ) === true ) {

            this.spaceUpdate();

        } else if ( this.player.state.is( "planet" ) === true ) {

            this.planetUpdate();

        } else if ( this.player.state.is( "spaceship" ) === true ) {

            this.spaceshipUpdate();
        }

        super.update();
    }

    private spaceUpdate(): void {

        this.spaceMovement();
    }

    private planetUpdate(): void {

        if ( this.planet === null ) {

            console.warn( "PlayerPhysics, planetUpdate: Planet is null." );
            return;
        }

        const up: BABYLON.Vector3 = this.planet.physics.pull( this );

        if ( this.state === PhysicsEntity.STATES.GROUND ) {

            this.planetMovement();
            EngineUtils.setTransformNodeDirection( this.player.root, undefined, up, this.player.config.standingup );
        }
    }

    private spaceshipUpdate(): void {

        if ( this.spaceship === null ) {

            console.warn( "PlayerPhysics, spaceshipUpdate: Spaceship is null." );
            return;
        }

        this.velocity.copyFromFloats( 0, 0, 0 );
        
        this.player.position.copyFrom( this.spaceship.position ).addInPlace( this.spaceship.config.seat.applyRotationQuaternion( this.spaceship.rotationQuaternion ) );
        this.player.rotationQuaternion.copyFrom( this.spaceship.rotationQuaternion );
    }

    private spaceMovement(): void {

        const floatConfig: float = this.player.config.float;
        const deltaCorrection: float = Engine.getInstance().deltaCorrection;
        const translate: BABYLON.Vector3 = new BABYLON.Vector3( 0, 0, 0 );

        const float: float = floatConfig * deltaCorrection;

        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.For ) === true ) {

            translate.z = float;

        } else if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Back ) === true ) {

            translate.z = -float;
        }
        
        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Right ) === true ) {

            translate.x = float;

        } else if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Left ) === true ) {

            translate.x = -float;
        }
        
        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Up ) === true ) {

            translate.y = float;

        } else if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Down ) === true ) {

            translate.y = -float;
        }

        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.LeftRoll ) === true ) {

            this.player.root.rotate( BABYLON.Axis.Z, float, BABYLON.Space.LOCAL );

        } else if ( Controls.getInstance().activeKeys.has( Controls.KEYS.RightRoll ) === true ) {

            this.player.root.rotate( BABYLON.Axis.Z, -float, BABYLON.Space.LOCAL );
        }

        this.movementTranslate( translate );
    }

    private planetMovement(): void {

        if ( this.planet === null ) {

            console.warn( "PlayerPhysics, planetMovement: Planet is null." );
            return;
        }

        const walkConfig: float = this.player.config.walk;
        const runConfig: float = this.player.config.run;
        const jumpConfig: float = this.player.config.jump;
        const deltaCorrection: float = Engine.getInstance().deltaCorrection;
        const translate: BABYLON.Vector3 = new BABYLON.Vector3( 0, 0, 0 );

        const walk: float = ( walkConfig / this.planet.config.gravity ) * deltaCorrection;
        const run: float = ( runConfig / this.planet.config.gravity ) * deltaCorrection;
        const jump: float = ( jumpConfig / this.planet.config.gravity ) * deltaCorrection;

        let speed: float = walk;

        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Fast ) === true ) {

            speed = run;
        }

        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.For ) === true ) {

            translate.z = speed;

        } else if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Back ) === true ) {

            translate.z = -speed;
        }
        
        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Right ) === true ) {

            translate.x = speed;

        } else if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Left ) === true ) {

            translate.x = -speed;
        }

        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Jump ) === true ) {

            translate.y = jump;
        }

        this.movementTranslate( translate );
    }

    private movementTranslate( translate: BABYLON.Vector3 ): void {
        
        const deceleration: float = 1.0 - this.player.config.deceleration;

        if ( translate.x !== 0 || translate.y !== 0 || translate.z !== 0 ) {

            this.velocity.addInPlace( translate.applyRotationQuaternionInPlace( this.player.rotationQuaternion ) );   
        }
            
        this.velocity.scaleInPlace( deceleration );
    }
    
}