/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SpaceshipPhysics extends PhysicsEntity implements ISpaceshipPhysics {

    public readonly spaceship: ISpaceship;

    public travel: ISpaceshipPhysicsTravel;

    public get thrust(): number {

        if ( this.spaceship.isLanded === true || this.travel.isJumping === true ) {

            return 0.0;
        }

        return this.localVelocity.length();
    }

    private localVelocity: BABYLON.Vector3 = new BABYLON.Vector3();

    public constructor( spaceship: ISpaceship ) {

        super( spaceship.root );
        
        this.spaceship = spaceship;

        this.setupTravel();
    }

    public override update(): void {
        
        this.preUpdate();

        if ( this.travel.isJumping === false ) {

            if ( this.spaceship.hasController === true ) {

                this.movement();
            }
            
            if ( this.spaceship.nearPlanet !== false ) {

                const up: BABYLON.Vector3 = this.spaceship.nearPlanet.physics.spin( this );
                
                this.landingLogic( up );
            }

            if ( this.spaceship.hasController === false && this.spaceship.isLanded === false ) {

                this.brake();
            }
        }
        
        this.travel.update();
        this.postUpdate();
    }

    private setupTravel(): void {

        this.travel = new SpaceshipPhysicsTravel( this );
    }

    private movement(): void {

        const deltaCorrection: number = Space.engine.deltaCorrection;
        const mainAcceleration: number = this.spaceship.config.mainAcceleration * deltaCorrection;
        const brakeScale: number = ( 1 - this.spaceship.config.brakeAcceleration ) * deltaCorrection;
        const minorAcceleration: number = this.spaceship.config.minorAcceleration * deltaCorrection;
        const rollSpeed: number = this.spaceship.config.rollSpeed * deltaCorrection;
        const acceleration: BABYLON.Vector3 = new BABYLON.Vector3( 0, 0, 0 );

        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.For ) === true ) {

            acceleration.z = mainAcceleration;

        } else if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Back ) === true ) {

            this.brakeVelocity( brakeScale );
        }
        
        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Right ) === true ) {

            acceleration.x = minorAcceleration;

        } else if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Left ) === true ) {

            acceleration.x = -minorAcceleration;
        }
        
        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Up ) === true ) {

            acceleration.y = minorAcceleration;

        } else if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Down ) === true ) {

            acceleration.y = -minorAcceleration;
        }

        if ( this.spaceship.isLanded === false ) {
                
            if ( Controls.getInstance().activeKeys.has( Controls.KEYS.LeftRoll ) === true ) {

                this.spaceship.root.rotate( BABYLON.Axis.Z, rollSpeed, BABYLON.Space.LOCAL );

            } else if ( Controls.getInstance().activeKeys.has( Controls.KEYS.RightRoll ) === true ) {

                this.spaceship.root.rotate( BABYLON.Axis.Z, -rollSpeed, BABYLON.Space.LOCAL );
            }
        }

        this.movementTranslate( acceleration );
    }
    
    private brake(): void {

        const velocityDrag: number = this.spaceship.config.velocityDrag;

        this.brakeVelocity();

        this.velocity.copyFrom( BABYLON.Vector3.Lerp( this.velocity, this.localVelocity.applyRotationQuaternion( this.spaceship.rotationQuaternion ), velocityDrag ) );
    }

    private brakeVelocity( brakeScale?: number ): void {

        if ( brakeScale === undefined ) {

            const deltaCorrection: number = Space.engine.deltaCorrection;
            brakeScale = ( 1 - this.spaceship.config.brakeAcceleration ) * deltaCorrection;
        }

        this.localVelocity.scaleInPlace( brakeScale );
        
        if ( this.velocity.length() < 0.05 ) {
            
            this.localVelocity.copyFromFloats( 0, 0, 0 );
            this.velocity.copyFromFloats( 0, 0, 0 );
        }
    }

    private movementTranslate( acceleration: BABYLON.Vector3 ): void {
        
        const velocityLimit: number = this.spaceship.config.velocityLimit;
        const velocityDrag: number = this.spaceship.config.velocityDrag;
        
        if ( acceleration.x !== 0 || acceleration.y !== 0 || acceleration.z !== 0 ) {

            this.localVelocity.addInPlace( acceleration );
        }
        
        if ( this.localVelocity.length() > velocityLimit ) {
                
            this.localVelocity.normalize().scaleInPlace( velocityLimit );
        }
        
        this.velocity.copyFrom( BABYLON.Vector3.Lerp( this.velocity, this.localVelocity.applyRotationQuaternion( this.spaceship.rotationQuaternion ), velocityDrag ) );
    }

    private landingLogic( up: BABYLON.Vector3 ): void {
        
        if ( this.spaceship.isLanded === false ) {

            if ( this.spaceship.nearPlanet !== false ) {

                const distanceAboveGround: number = this.spaceship.nearPlanet.physics.getDistanceAboveGround( this, up ).clamp( 0, Infinity );
            
                this.adjustCollider( distanceAboveGround );
                this.checkLanding( up, distanceAboveGround );
            }

        } else {

            this.freezeCollider();
            this.velocity.copyFromFloats( 0, 0, 0 );
            EngineUtils.setTransformNodeDirection( this.spaceship.root, undefined, up, this.spaceship.config.upLerp );
            this.checkTakeoff();
        }
    }

    private adjustCollider( distanceAboveGround: number ): void {

        if ( distanceAboveGround - this.colliderMax < 0 ) {

            const targetSize: number = this.colliderMin;
            const lerp: number = 1 - ( ( distanceAboveGround - targetSize ) / ( this.colliderMax - targetSize ) );

            this.setColliderSize( BABYLON.Vector3.Lerp( this.colliderSize, BABYLON.Vector3.One().scaleInPlace( targetSize ), lerp.clamp( 0, 1 ) ) );
        }
    } 

    private freezeCollider(): void {

        this.setColliderSize( BABYLON.Vector3.One().scaleInPlace( this.colliderMin ) );
    }

    private checkLanding( up: BABYLON.Vector3, distanceAboveGround: number ): void {

        const downAngle = Math.acos( BABYLON.Vector3.Dot( up.negate(), this.velocity.normalizeToNew() ) );

        if ( downAngle < this.spaceship.config.landingAngle && distanceAboveGround < this.colliderMin ) {

            this.spaceship.land();

            this.localVelocity.copyFromFloats( 0, 0, 0 );
            this.velocity.copyFromFloats( 0, 0, 0 );
        }
    }
    
    private checkTakeoff(): void {

        const upAngle: number = Math.acos( BABYLON.Vector3.Dot( BABYLON.Vector3.Up(), this.localVelocity.normalizeToNew() ) );

        if ( upAngle < this.spaceship.config.landingAngle ) {

            this.spaceship.takeoff();
        }
    }

}