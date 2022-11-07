/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Camera implements ICamera {

    /* Singleton */ 
    private static instance: ICamera; 
    public static instantiate(): void { if ( this.instance === undefined ) this.instance = new Camera(); } 
    public static getInstance(): ICamera { return this.instance; }

    public config: IConfig = new Config(  

        [ "max", 10_000_000 ]
    );
    
    public root: BABYLON.TransformNode;
    public camera: BABYLON.ArcRotateCamera;

    public readonly state: IStateMachine = new StateMachine();
    
    public get position(): BABYLON.Vector3 {
        
        return this.origin.actual;
    }

    public get rotationQuaternion(): BABYLON.Quaternion {
        
        if ( this.root.rotationQuaternion === null ) {

            this.root.rotationQuaternion = this.root.rotation.toQuaternion();
        }

        return this.root.rotationQuaternion;
    }

    protected origin: ICameraOrigin;

    private target: ICameraTargetable | null;
    private targetCamera: ICameraTarget | null;

    private playerTargetCamera: ICameraTargetPlayer;
    private spaceshipTargetCamera: ICameraTargetSpaceship;

    private constructor() {

        this.createRoot();
        this.setupStates();
        this.createCamera();
        this.addOrigin();
        this.addTargets();
        this.registerObservables();
    }

    public attachToPlayer( player: IPlayer ): void {

        this.state.set( "player", player );
    }

    public attachToSpaceship( spaceship: ISpaceship ): void {

        this.state.set( "spaceship", spaceship );
    }

    public update(): void {

        if ( this.target !== null ) {
            
            this.targetCamera?.update( this.target );
        }
    }

    public getScreenDistance( source: BABYLON.Vector3 | BABYLON.TransformNode ): number {

        return Math.sqrt( this.getScreenSquaredDistance( source ) );
    }

    public getScreenSquaredDistance( source: BABYLON.Vector3 | BABYLON.TransformNode ): number {

        if ( source instanceof BABYLON.Vector3 ) {

            return BABYLON.Vector3.DistanceSquared( source, this.position );
        }

        return BABYLON.Vector3.DistanceSquared( EngineUtils.getWorldPosition( source ), this.position );
    }

    public getApproximateScreenDistance( source: BABYLON.TransformNode ): number {
        
        return this.getScreenDistance( source );
    }

    public getScreenCoverage( node: BABYLON.TransformNode, size?: number ): number {

        const distance: number = this.getApproximateScreenDistance( node );
        const useSize: number = size || EngineUtils.getBoundingSize( node );
        
        return useSize / distance;
    }

    private createRoot(): void {

        this.root = new BABYLON.TransformNode( "camera", Space.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    private setupStates(): void {

        this.state.add( "player", ( oldState: string, player: IPlayer ): void => this.onPlayerEnter( oldState, player ), ( newState: string ): void => this.onPlayerLeave( newState ) );
        this.state.add( "spaceship", ( oldState: string, spaceship: ISpaceship ): void => this.onSpaceshipEnter( oldState, spaceship ), ( newState: string ): void => this.onSpaceshipLeave( newState ) );
    }

    private createCamera(): void {

        this.camera = new BABYLON.ArcRotateCamera( "camera_camera", -Math.PI / 2, Math.PI / 2, 0, BABYLON.Vector3.Zero(), Space.scene );
        this.camera.maxZ = this.config.max;
        this.camera.parent = this.root;
    }

    private addOrigin(): void {

        this.origin = new CameraOrigin( this );
    }

    private addTargets(): void {

        this.playerTargetCamera = new CameraTargetPlayer( this, {} );
        this.spaceshipTargetCamera = new CameraTargetSpaceship( this, {} );
    }
    
    private registerObservables(): void {

        Controls.getInstance().onPointerMove.add( ( event: BABYLON.PointerInfo ): void => this.onPointerMove( event ) );
    }

    private onPointerMove( event: BABYLON.PointerInfo ): void {
        
        if ( this.target !== null ) {

            this.targetCamera?.onPointerMove( this.target, event );
        }
    }
    
    private enterTarget( target: ICameraTargetable, camera: ICameraTarget ) {

        this.target = target;
        this.targetCamera = camera;
        this.targetCamera.focus( 1.0 );
    }

    private leaveTarget(): void {

        this.target = null;
        this.targetCamera = null;
    }
    
    private onPlayerEnter( _oldState: string, player: IPlayer ): void {

        log( "camera attached to player" );

        this.enterTarget( player, this.playerTargetCamera );
    }

    private onPlayerLeave( _newState: string ): void {
        
        log( "camera detached from player" );
        
        this.leaveTarget();
    }
    
    private onSpaceshipEnter( _oldState: string, spaceship: ISpaceship ): void {
        
        log( "camera attached to spaceship" );
        
        this.enterTarget( spaceship, this.spaceshipTargetCamera );
    }
    
    private onSpaceshipLeave( _newState: string ): void {
        
        log( "camera detached from spaceship" );
        
        this.leaveTarget();
    }

}