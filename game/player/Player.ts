/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Player implements IPlayer {

    /* Singleton */ 
        private static instance: IPlayer; 
        public static instantiate(): void { if ( this.instance === undefined ) this.instance = new Player(); } 
        public static getInstance(): IPlayer { return this.instance; }
        
    
    public config: IConfig = {
        
        float: 0.005,
    
        walk: 0.005,
        run: 0.015,
        jump: 0.01,
    
        standingup: 0.05,
        deceleration: 0.15
    };

    public mesh: BABYLON.Mesh;
    public physics: IPlayerPhysics;
    public interaction: IPlayerInteraction;

    public readonly state: StateMachine = new StateMachine();

    public get root(): BABYLON.Mesh {
    
        return this.mesh;
    }

    public get position(): BABYLON.Vector3 {
        
        return this.root.position;
    }

    public get rotationQuaternion(): BABYLON.Quaternion {
        
        if ( this.root.rotationQuaternion === null ) {

            this.root.rotationQuaternion = this.root.rotation.toQuaternion();
        }

        return this.root.rotationQuaternion;
    }

    public get planet(): Nullable< IPlanet > {

        return this.physics.planet;
    }

    public get spaceship(): Nullable< IAbstractSpaceship > {

        return this.physics.spaceship;
    }

    private constructor() {

        this.createMesh();    
        this.setupStates();
        this.setupPhysics();
        this.setupInteraction();
    }

    public update(): void {

        this.physics.update();
        this.interaction.update();
    }

    public planetInsert( planet: IPlanet, distance: float, planetThreashold: float ): void {

        if ( distance <= planetThreashold && this.state.is( "space" ) === true ) {

            this.state.set( "planet", planet );
        }

        if ( this.state.is( "planet" ) === true && this.planet !== null && PlanetUtils.compare( this.planet, planet ) && distance > planetThreashold ) {

            this.state.set( "space" );
        }
    }

    private setupStates(): void {

        this.state.add( "space", ( oldState: string ): void => this.onSpaceEnter( oldState ), ( newState: string ): void => this.onSpaceLeave( newState ) );
        this.state.add( "planet",( oldState: string, planet: IPlanet ): void => this.onPlanetEnter( oldState, planet ), ( newState: string ): void => this.onPlanetLeave( newState ) );
        this.state.add( "spaceship",( oldState: string, spaceship: IAbstractSpaceship ): void => this.onSpaceshipEnter( oldState, spaceship ), ( newState: string ): void => this.onSpaceshipLeave( newState ) );

        this.state.set( "space" );
    }

    private createMesh(): void {

        const body: BABYLON.Mesh = BABYLON.MeshBuilder.CreateCapsule( "player_mesh_body", { height: 2, radius: 0.5, tessellation: 8, subdivisions: 1, capSubdivisions: 3 }, scene );

        const head: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox( "player_mesh_head", { width: 0.7, height: 0.35, depth: 0.3 }, scene );
        head.position.copyFromFloats( 0, 0.5, 0.4 );

        const merged: Nullable< BABYLON.Mesh > = BABYLON.Mesh.MergeMeshes( [ body, head ], true );

        if ( merged !== null ) {

            this.mesh = merged;
            this.mesh.removeVerticesData( BABYLON.VertexBuffer.NormalKind );
            this.mesh.removeVerticesData( BABYLON.VertexBuffer.UVKind );
            this.mesh.id = "player";
            this.mesh.name = this.mesh.id;
            this.mesh.isPickable = false;

            const material: BABYLON.StandardMaterial = new BABYLON.StandardMaterial( "player_material", scene );
            EngineExtensions.setStandardMaterialColorIntensity( material, "#ff226b", 0.5 );
            material.freeze();

            this.mesh.material = material;
            this.mesh.rotationQuaternion = this.mesh.rotation.toQuaternion();
            
            Star.getInstance().shadow.cast( this.mesh, false, true );
            Star.getInstance().shadow.receive( this.mesh, false, true );
        }

        /*
        var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1), Math.PI / 3, 20, scene);
        light.intensity = 4;
        light.parent = this.root;
        */
    }

    private setupPhysics(): void {

        this.physics = new PlayerPhysics( this );
    }
    
    private setupInteraction(): void {

        this.interaction = new PlayerInteraction( this );
    }

    private onSpaceEnter( _oldState: string ): void {

        log( "player entered space" );

        Camera.getInstance().attachToPlayer( this );
    }

    private onSpaceLeave( _newState: string ): void {
        
        log( "player left space" );
    }
    
    private onPlanetEnter( _oldState: string, planet: IPlanet ): void {
        
        log( "player entered planet" );

        this.physics.planet = planet;
    }
    
    private onPlanetLeave( _newState: string ): void {
        
        log( "player left planet" );

        this.physics.planet = null;
    }

    private onSpaceshipEnter( _oldState: string, spaceship: IAbstractSpaceship ): void {
        
        log( "player entered spaceship" );

        this.physics.pause();
        
        this.physics.spaceship = spaceship;
        this.physics.spaceship.enter( this );

        Camera.getInstance().attachToSpaceship( this.physics.spaceship );
    }
    
    private onSpaceshipLeave( _newState: string ): void {
        
        log( "player left spaceship" );

        if ( this.physics.spaceship !== null ) {

            this.physics.spaceship.leave( this );
            this.physics.spaceship = null;
        }

        this.physics.resume();
    }

}