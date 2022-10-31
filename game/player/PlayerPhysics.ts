/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerPhysics extends PhysicsEntity implements IPlayerPhysics {

    public readonly player: IPlayer;
    public readonly controls: IControls;

    public planet: IPlanet | null;
    public spaceship: ISpaceship | null;

    public constructor( player: IPlayer ) {

        super( player.game, player.root );
        
        this.player = player;
        this.controls = this.player.controls;
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

        const floatConfig: number = this.player.config.float;
        const deltaCorrection: number = this.player.game.engine.deltaCorrection;
        const translate: BABYLON.Vector3 = new BABYLON.Vector3( 0, 0, 0 );

        const float: number = floatConfig * deltaCorrection;

        if ( this.controls.activeKeys.has( Controls.KEYS.For ) === true ) {

            translate.z = float;

        } else if ( this.controls.activeKeys.has( Controls.KEYS.Back ) === true ) {

            translate.z = -float;
        }
        
        if ( this.controls.activeKeys.has( Controls.KEYS.Right ) === true ) {

            translate.x = float;

        } else if ( this.controls.activeKeys.has( Controls.KEYS.Left ) === true ) {

            translate.x = -float;
        }
        
        if ( this.controls.activeKeys.has( Controls.KEYS.Up ) === true ) {

            translate.y = float;

        } else if ( this.controls.activeKeys.has( Controls.KEYS.Down ) === true ) {

            translate.y = -float;
        }

        if ( this.controls.activeKeys.has( Controls.KEYS.LeftRoll ) === true ) {

            this.player.root.rotate( BABYLON.Axis.Z, float, BABYLON.Space.LOCAL );

        } else if ( this.controls.activeKeys.has( Controls.KEYS.RightRoll ) === true ) {

            this.player.root.rotate( BABYLON.Axis.Z, -float, BABYLON.Space.LOCAL );
        }

        this.movementTranslate( translate );
    }

    private planetMovement(): void {

        if ( this.planet === null ) {

            console.warn( "PlayerPhysics, planetMovement: Planet is null." );
            return;
        }

        const walkConfig: number = this.player.config.walk;
        const runConfig: number = this.player.config.run;
        const jumpConfig: number = this.player.config.jump;
        const deltaCorrection: number = this.player.game.engine.deltaCorrection;
        const translate: BABYLON.Vector3 = new BABYLON.Vector3( 0, 0, 0 );

        const walk: number = ( walkConfig / this.planet.config.gravity ) * deltaCorrection;
        const run: number = ( runConfig / this.planet.config.gravity ) * deltaCorrection;
        const jump: number = ( jumpConfig / this.planet.config.gravity ) * deltaCorrection;

        let speed: number = walk;

        if ( this.controls.activeKeys.has( Controls.KEYS.Fast ) === true ) {

            speed = run;
        }

        if ( this.controls.activeKeys.has( Controls.KEYS.For ) === true ) {

            translate.z = speed;

        } else if ( this.controls.activeKeys.has( Controls.KEYS.Back ) === true ) {

            translate.z = -speed;
        }
        
        if ( this.controls.activeKeys.has( Controls.KEYS.Right ) === true ) {

            translate.x = speed;

        } else if ( this.controls.activeKeys.has( Controls.KEYS.Left ) === true ) {

            translate.x = -speed;
        }

        if ( this.controls.activeKeys.has( Controls.KEYS.Jump ) === true ) {

            translate.y = jump;
        }

        this.movementTranslate( translate );
    }

    private movementTranslate( translate: BABYLON.Vector3 ): void {
        
        const deceleration: number = 1 - this.player.config.deceleration;

        if ( translate.x !== 0 || translate.y !== 0 || translate.z !== 0 ) {

            this.velocity.addInPlace( translate.applyRotationQuaternionInPlace( this.player.rotationQuaternion ) );   
        }
            
        this.velocity.scaleInPlace( deceleration );
    }
    
}