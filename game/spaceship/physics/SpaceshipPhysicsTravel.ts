/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipPhysicsTravel implements ISpaceshipPhysicsTravel {

    public static readonly VELOCITY: number = 128;

    public readonly spaceshipPhysics: ISpaceshipPhysics;

    public get isTraveling(): boolean {

        return this.traveling;
    }

    public get isJumping(): boolean {

        return this.jumping === false ? false : true;
    }

    private pressedThreshold: number = 500;
    private pointingThreshold: number = 0.1;

    private pressedTime: number = 0;
    private traveling: boolean = false;
    private jumping: false | IUIMarker = false;

    public constructor( spaceshipPhysics: ISpaceshipPhysics ) {

        this.spaceshipPhysics = spaceshipPhysics;
    }

    public update(): void {
        
        if ( this.spaceshipPhysics.spaceship.hasController === false ) {
        
            return;
        }

        if ( this.isJumping === false ) {

            this.evaluate();

        } else {

            this.updateJumping();
        }
    }

    private evaluate(): void {

        const potential = this.getPotentialMarker();

        if ( potential !== null ) {

            potential.lightUp = true;

            if ( this.evaluateKeyPress() === true ) {

                this.onKeyPress( potential );
            }
        }
    }

    private evaluateKeyPress(): boolean {

        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Travel ) === true && Date.now() - this.pressedTime > this.pressedThreshold ) {

            this.pressedTime = Date.now();

            return true;
        }

        return false;
    }

    private getPotentialMarker(): Nullable< IUIMarker > {

        const markers: IUIMarker[] | undefined = UI.getInstance().markers.get( "travel" );
        const direction: BABYLON.Vector3 = this.spaceshipPhysics.spaceship.root.forward;
        
        if ( markers === undefined ) {

            return null;
        }

        for ( let i: number = 0; i < markers.length; i++ ) {

            markers[i].lightUp = false;

            if ( markers[i].isNear === false && Math.acos( BABYLON.Vector3.Dot( direction, markers[i].direction ) ) < this.pointingThreshold ) {

                return markers[i];   
            }
        }

        return null;
    }
    
    private onKeyPress( potential: Nullable< IUIMarker > ): void {

        if ( this.traveling === false ) {

            this.traveling = true;

        } else {

            if ( potential !== null ) {

                this.startJumping( potential );

            } else {

                this.traveling = false;
            }
        }
    }

    private startJumping( potential: IUIMarker ): void {

        this.jumping = potential;
        EngineUtils.setTransformNodeDirection( this.spaceshipPhysics.spaceship.root, this.jumping.direction );   
        //this.spaceshipPhysics.pause( false, true );
    }
    
    private updateJumping(): void {

        if ( this.jumping === false ) {

            return;
        }

        const size = EngineUtils.getBoundingSize( this.jumping.transformNode );
        
        if ( this.jumping.distance > size / 2 && this.evaluateKeyPress() === false ) {

            this.spaceshipPhysics.velocity.copyFrom( this.jumping.direction ).scaleInPlace( SpaceshipPhysicsTravel.VELOCITY * Engine.getInstance().deltaCorrection );

        } else {

            this.stopJumping();
        }
    }

    private stopJumping(): void {

        this.spaceshipPhysics.velocity.copyFromFloats( 0, 0, 0 );
        //this.spaceshipPhysics.resume();
        this.jumping = false;
    }

}