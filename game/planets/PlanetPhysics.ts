/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetPhysics {

    public readonly planet: IPlanet;

    public constructor( planet: IPlanet ) {

        this.planet = planet;
    }

    public enable( mesh: BABYLON.Mesh, size: number ): void {
        
        if ( size === this.planet.config.min ) {

            PhysicsEntity.collidable( mesh );
        }
    }

    public disable( mesh: BABYLON.Mesh ): void {

        PhysicsEntity.collidable( mesh, undefined, false );
    }

    public pull( physicsEntity: IPhysicsEntity ): BABYLON.Vector3 {

        const delta: BABYLON.Vector3 = this.getDelta( physicsEntity.position );
        const distanceCenter: number = delta.length();
        const up: BABYLON.Vector3 = delta.clone().normalize();
        
        this.pullSpin( physicsEntity, distanceCenter );
        this.pullGravity( physicsEntity, up );
        
        physicsEntity.registerPull( this.getDistanceAboveGround( physicsEntity, up ) );

        return up;
    }

    public spin( physicsEntity: IPhysicsEntity ): BABYLON.Vector3 {

        const delta: BABYLON.Vector3 = this.getDelta( physicsEntity.position );
        const distanceCenter: number = delta.length();
        const up: BABYLON.Vector3 = delta.clone().normalize();
        
        this.pullSpin( physicsEntity, distanceCenter );

        return up;
    }

    public getDistanceAboveGround( physicsEntity: IPhysicsEntity, up: BABYLON.Vector3 ): number {

        return BABYLON.Vector3.Distance( this.projectOnSurface( up ), physicsEntity.position );
    }

    private getDelta( position: BABYLON.Vector3 ): BABYLON.Vector3 {
    
        return position.subtract( this.planet.position );
    }

    private projectOnSurface( up: BABYLON.Vector3 ): BABYLON.Vector3 {

        const noise: number = PlanetUtils.noise( this.planet, up.rotateByQuaternionToRef( this.planet.rotationQuaternion.invert(), BABYLON.Vector3.Zero() ) );

        return up.clone().scaleInPlace( this.planet.config.radius + noise ).addInPlace( this.planet.position );
    }

    private pullSpin( physicsEntity: IPhysicsEntity, distanceCenter: number ): void {

        if ( this.planet.config.spin !== false ) {

            const deltaCorrection = Engine.getInstance().deltaCorrection;
            const deltaAngle = this.planet.config.spin * EngineUtils.toRadian * deltaCorrection * this.getSpinFactor( distanceCenter );

            physicsEntity.delta.addInPlace( 
                physicsEntity.position
                .rotateByQuaternionAroundPointToRef( this.deltaAngleToQuaternion( deltaAngle ), this.planet.position.clone(), BABYLON.Vector3.Zero() )
                .subtractInPlace( physicsEntity.position )
            );
        }
    }

    private getSpinFactor( distanceCenter: number ): number {

        const distanceAboveMaxHeight = distanceCenter - this.planet.config.radius - this.planet.config.maxHeight;
        const distanceBetweenMaxHeight = this.planet.config.influence - this.planet.config.maxHeight;

        return ( 1 - ( distanceAboveMaxHeight / distanceBetweenMaxHeight ) ).clamp( 0, 1 );
    }

    private deltaAngleToQuaternion( deltaAngle: number ): BABYLON.Quaternion {

        return BABYLON.Quaternion.FromEulerVector( BABYLON.Vector3.Up().scaleInPlace( deltaAngle ) );
    }

    private pullGravity( physicsEntity: IPhysicsEntity, up: BABYLON.Vector3 ): void {

        const deltaCorrection = Engine.getInstance().deltaCorrection;
        const acceleration = physicsEntity.getAcceleration();
        
        physicsEntity.delta.addInPlace( up.scale( -this.planet.config.gravity * 0.1 * acceleration * deltaCorrection ) );
    }

}