/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTargetSpaceship extends CameraTarget implements ICameraTargetSpaceship {

    public override config: IConfig = new Config(  

        [ "offsetRadius", 18 ],

        [ "focusBeta", Math.PI / 2.2 ],

        [ "lerpPos", 0.1 ],
        [ "lerpRot", 0.025 ],

        [ "follow", 0.0015 ]
    );

    private followXVelocity: number = 0;
    private followYVelocity: number = 0;

    public constructor( camera: ICamera, config: IConfig ) {

        super( camera, config );
        
        EngineUtils.configure( this, config );
    }

    public override update( spaceship: ISpaceship ): void {

        this.adaptOffsetRadius( spaceship );

        super.update( spaceship );

        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Free ) === false && spaceship.isLanded === false && spaceship.physics.travel.isJumping === false ) {

            this.focus();
        }

        this.applyFollowVelocity( spaceship );
    }

    public override onPointerMove( spaceship: ISpaceship, event: BABYLON.PointerInfo ): void {

        if ( Controls.getInstance().isPointerDown === true || Controls.getInstance().config.experimentalPointerLock === true ) {

            if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Free ) === true || spaceship.isLanded === true || spaceship.physics.travel.isJumping === true ) {

                this.free( event );

            } else {

                this.followPointer( spaceship, event );
            }
        }
    }

    protected override followPointer( _spaceship: ISpaceship, event: BABYLON.PointerInfo ): void {
        
        this.followXVelocity += event.event.movementX * this.config.follow * 0.1;
        this.followYVelocity += event.event.movementY * this.config.follow * 0.1;
    }

    protected override syncPosition( spaceship: ISpaceship ): BABYLON.Vector3 {

        if ( spaceship.physics.travel.isJumping === true ) {

            return spaceship.position.add( this.config.offset.applyRotationQuaternion( spaceship.rotationQuaternion ) );
        }
        
        return super.syncPosition( spaceship );
    }

    private adaptOffsetRadius( spaceship: ISpaceship ): void {

        this.config.offsetRadius = EngineUtils.getBoundingSize( spaceship.root ) * 1.2;
    }

    private applyFollowVelocity( spaceship: ISpaceship ): void {

        const deltaCorrection: number = Space.engine.deltaCorrection;

        spaceship.root.rotate( BABYLON.Axis.Y, this.followXVelocity * deltaCorrection, BABYLON.Space.LOCAL );
        spaceship.root.rotate( BABYLON.Axis.X, this.followYVelocity * deltaCorrection, BABYLON.Space.LOCAL );

        this.followXVelocity = BABYLON.Scalar.Lerp( this.followXVelocity, 0, 0.05 );
        this.followYVelocity = BABYLON.Scalar.Lerp( this.followYVelocity, 0, 0.05 );
    }

}