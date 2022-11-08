/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface Object {

    physicsEntityType?: EPhysicsTypes;

}

class PhysicsEntity implements IPhysicsEntity {

    public static TYPES = EPhysicsTypes;
    public static STATES = EPhysicsStates;

    protected static COLLIDER_SCALE: number = 0.8;
    
    public static collidable( mesh: BABYLON.AbstractMesh, type: EPhysicsTypes = PhysicsEntity.TYPES.STATIC, value?: boolean ): void {
        //!!!!EntityLOD line 60 investigate!!!!
        mesh.physicsEntityType = type;
        
        PhysicsEntity.collisions( mesh, value === undefined ? true : value );
    }

    protected static collisions( mesh: BABYLON.AbstractMesh, checkCollisions: boolean ): void {
        
        if ( mesh.__collisionMesh !== undefined ) {

            mesh.__collisionMesh.checkCollisions = checkCollisions;

            return;
        }

        mesh.checkCollisions = checkCollisions;
    }

    public readonly delta: BABYLON.Vector3 = new BABYLON.Vector3( 0, 0, 0 );
    public readonly velocity: BABYLON.Vector3 = new BABYLON.Vector3( 0, 0, 0 );

    public readonly mesh: BABYLON.AbstractMesh | BABYLON.TransformNode;
    
    public readonly type: EPhysicsTypes;

    public get position(): BABYLON.Vector3 {
        
        return this.mesh.position;
    }

    public get rotationQuaternion(): BABYLON.Quaternion {
        
        if ( this.mesh.rotationQuaternion === null ) {

            this.mesh.rotationQuaternion = this.mesh.rotation.toQuaternion();
        }

        return this.mesh.rotationQuaternion;
    }

    public get state(): EPhysicsStates {

        return this.stateValue;
    }

    public set state( value ) {

        this.stateValue = value;

        if ( this.stateValue === PhysicsEntity.STATES.GROUND ) {

            this.lastTimeOnGround = 0;
        }
    }

    public get colliderMax(): number {

        if ( this.mesh instanceof BABYLON.AbstractMesh ) {

            return (this.mesh.ellipsoid.max || 0) + (this.mesh.ellipsoidOffset.biggest || 0);
        }

        return 0;
    }

    public get colliderMin(): number {

        return this.colliderMinValue / PhysicsEntity.COLLIDER_SCALE;
    }

    public get colliderSize(): BABYLON.Vector3 {

        if ( this.mesh instanceof BABYLON.AbstractMesh ) {

            return this.mesh.ellipsoid.clone();
        }

        return BABYLON.Vector3.Zero();
    }

    protected readonly debug: boolean = false;
    protected debugMesh: BABYLON.Mesh;
    
    private stateValue: EPhysicsStates = PhysicsEntity.STATES.FLOATING;
    
    private isPaused: boolean = false;
    private isCollidingPaused: boolean = false;
    private colliderMinValue: number;
    
    private lastTimeOnGround: number = 0;

    public constructor( mesh: BABYLON.AbstractMesh | BABYLON.TransformNode, type: EPhysicsTypes = PhysicsEntity.TYPES.DYNAMIC ) {

        this.mesh = mesh;
        this.type = type;

        if ( this.mesh instanceof BABYLON.AbstractMesh ) {

            PhysicsEntity.collidable( this.mesh, this.type );
            this.setupFitCollider();
            this.setupDebug();
        }
    }

    public update(): void {
        
        this.preUpdate();
        this.postUpdate();
    }

    public pause( allowCollisions: boolean = false, allowUpdate: boolean = false ): void {

        this.isPaused = !allowUpdate;

        if ( this.mesh instanceof BABYLON.AbstractMesh ) {

            this.isCollidingPaused = !allowCollisions;
            PhysicsEntity.collisions( this.mesh, allowCollisions );
        }
    }

    public resume(): void {

        if ( this.mesh instanceof BABYLON.AbstractMesh ) {

            PhysicsEntity.collisions( this.mesh, true );
            this.isCollidingPaused = false;
        }
        
        this.isPaused = false;
    }

    public registerPull( distanceAboveGround: number ): void {
        
        this.lastTimeOnGround++;
        
        if ( distanceAboveGround - this.colliderMax < 0 ) {

            this.state = PhysicsEntity.STATES.GROUND;

        } else {

            this.state = PhysicsEntity.STATES.FLOATING;
        }
    }

    public getAcceleration(): number {

        return this.lastTimeOnGround / 100;
    }

    public setColliderSize( size: BABYLON.Vector3 ): void {

        if ( this.mesh instanceof BABYLON.AbstractMesh ) {

            this.mesh.ellipsoid.copyFrom( size );
        
            EngineUtils.minmax( this.mesh.ellipsoid );
        }
    }

    protected preUpdate(): void {
        
        if ( this.isPaused === true || Physics.getInstance().isPaused === true ) {

            return;
        }

        this.updateFitCollider();
    }

    protected postUpdate(): void {

        if ( this.isPaused === true || Physics.getInstance().isPaused === true ) {

            return;
        }

        if ( this.velocity.x !== 0 || this.velocity.y !== 0 || this.velocity.z !== 0 ) {

            this.delta.addInPlace( this.velocity );
        }

        if ( this.delta.x !== 0 || this.delta.y !== 0 || this.delta.z !== 0 ) {

            if ( this.isCollidingPaused === false && this.mesh instanceof BABYLON.AbstractMesh ) {

                PhysicsEntity.collisions( this.mesh, false );
                this.mesh.moveWithCollisions( this.delta );
                PhysicsEntity.collisions( this.mesh, true );

            } else {

                this.mesh.position.addInPlace( this.delta );
            }
        }

        this.delta.copyFromFloats( 0, 0, 0 );
        this.updateDebug();
    }

    private setupFitCollider(): void {
        
        if ( this.mesh instanceof BABYLON.AbstractMesh ) {

            this.fitCollider();
            this.colliderMinValue = this.mesh.ellipsoid.min || 0;
        }
    }
    
    private fitCollider(): void {

        if ( this.mesh instanceof BABYLON.AbstractMesh ) {

            const boundingInfo: BABYLON.BoundingInfo = this.mesh.__collisionMesh !== undefined ? this.mesh.__collisionMesh.getBoundingInfo() : this.mesh.getBoundingInfo();

            this.mesh.ellipsoid.copyFrom( boundingInfo.boundingBox.extendSizeWorld ).scaleInPlace( PhysicsEntity.COLLIDER_SCALE );
            this.mesh.ellipsoidOffset.copyFrom( boundingInfo.boundingBox.center ).applyRotationQuaternionInPlace( this.rotationQuaternion ).multiplyInPlace( this.mesh.scaling );

            EngineUtils.minmax( this.mesh.ellipsoid );
            EngineUtils.minmax( this.mesh.ellipsoidOffset );
        }
    }

    private updateFitCollider(): void {

        this.fitCollider();
    }

    private setupDebug( mesh: BABYLON.AbstractMesh | BABYLON.TransformNode = this.mesh ): void {

        if ( this.debug === false ) {

            return;
        }

        if ( mesh instanceof BABYLON.AbstractMesh ) {

            this.debugMesh = BABYLON.MeshBuilder.CreateSphere( "debugMesh", { diameter: 1, segments: 8 }, scene );
            this.debugMesh.isPickable = false;
            this.debugMesh.material = debugMaterialRed;
            this.updateDebug( mesh );
            
            if ( mesh.__collisionMesh !== undefined ) {

                mesh.__collisionMesh.isVisible = true;
            }
        }
    }

    private updateDebug( mesh: BABYLON.AbstractMesh | BABYLON.TransformNode = this.mesh ): void {

        if ( mesh instanceof BABYLON.AbstractMesh ) {

            this.debugMesh?.position.copyFrom( mesh.position ).addInPlace( mesh.ellipsoidOffset );
            this.debugMesh?.scaling.copyFrom( mesh.ellipsoid ).scaleInPlace( 2 );
        }
    }

}