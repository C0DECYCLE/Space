/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Star implements IStar {

    /* Singleton */ 
        private static instance: IStar; 
        public static instantiate(): void { if ( this.instance === undefined ) this.instance = new Star(); } 
        public static getInstance(): IStar { return this.instance; }
        
        
    public config: IConfig = {
        
        color: "#fff9bc",
    
        size: 20_000,
        resolution: 16
    };

    public directionalLight: BABYLON.DirectionalLight;
    public hemisphericLight: BABYLON.HemisphericLight;

    public mesh: BABYLON.Mesh;
    public godrays: BABYLON.VolumetricLightScatteringPostProcess;
    public shadow: IStarShadow;
    public background: BABYLON.Mesh;
    
    public get position(): BABYLON.Vector3 {
        
        return this.mesh.position;
    }

    public get rotationQuaternion(): BABYLON.Quaternion {
        
        if ( this.mesh.rotationQuaternion === null ) {

            this.mesh.rotationQuaternion = this.mesh.rotation.toQuaternion();
        }

        return this.mesh.rotationQuaternion;
    }

    public get lightDirection(): BABYLON.Vector3 {

        return this.directionalLight.direction;
    }

    private constructor() {

        this.createMesh();
        this.createDirectionalLight( 0.4 );
        this.createHemisphericLight( 0.02 );
        this.createShadow();
        this.addGodrays();
        this.createBackground();
    }

    public update(): void {

        this.target();
        this.shadow.update();
    }

    private createMesh(): void {

        const material: BABYLON.StandardMaterial = new BABYLON.StandardMaterial( "star_material", scene );
        material.disableLighting = true;
        material.diffuseColor.set( 0, 0, 0 );
        material.specularColor.set( 0, 0, 0 );
        material.emissiveColor = BABYLON.Color3.FromHexString( this.config.color );
        material.ambientColor.set( 0, 0, 0 );
        material.freeze();

        this.mesh = BABYLON.MeshBuilder.CreateSphere( "star", { diameter: this.config.size, segments: this.config.resolution }, scene );
        this.mesh.removeVerticesData( BABYLON.VertexBuffer.NormalKind );
        this.mesh.removeVerticesData( BABYLON.VertexBuffer.UVKind );
        this.mesh.rotationQuaternion = this.mesh.rotation.toQuaternion();
        this.mesh.isPickable = false;
        this.mesh.material = material;

        PhysicsEntity.collidable( this.mesh );
    }

    private createDirectionalLight( intensity: float ): void {

        this.directionalLight = new BABYLON.DirectionalLight( "star_directionalLight", BABYLON.Vector3.Zero(), scene );
        EngineExtensions.setLightColor( this.directionalLight, this.config.color );
        EngineExtensions.setLightIntensity( this.directionalLight, intensity );
    }

    private createHemisphericLight( intensity: float ): void {

        this.hemisphericLight = new BABYLON.HemisphericLight( "star_hemisphericLight", BABYLON.Vector3.Up(), scene );
        EngineExtensions.setLightColor( this.hemisphericLight, this.config.color );
        EngineExtensions.setLightIntensity( this.hemisphericLight, intensity );
    }

    private createShadow(): void {

        this.shadow = new StarShadow( this, this.directionalLight );
    }

    private addGodrays(): void {

        this.godrays = PostProcess.getInstance().godrays( this.mesh );
    }

    private createBackground(): void {

        this.background = BABYLON.MeshBuilder.CreateSphere( "star_background", { diameter: Camera.getInstance().config.max, segments: 4, sideOrientation: BABYLON.Mesh.BACKSIDE }, scene );
        this.background.removeVerticesData( BABYLON.VertexBuffer.NormalKind );
        
        this.background.isPickable = false;

        const material: BABYLON.StandardMaterial = new BABYLON.StandardMaterial( "star_background_material", scene );
        material.disableLighting = true;
        
        material.diffuseColor = new BABYLON.Color3( 0, 0, 0 );
        material.specularColor = new BABYLON.Color3( 0, 0, 0 );
        material.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        material.ambientColor = new BABYLON.Color3( 0, 0, 0 );

        const emissiveTexture: BABYLON.Texture = new BABYLON.Texture( "assets/textures/space.png", scene );
        emissiveTexture.uScale = 6;
        emissiveTexture.vScale = 6;

        material.emissiveTexture = emissiveTexture;
        material.freeze();

        this.background.material = material;
    }

    private target(): void {

        this.directionalLight.position.copyFrom( Camera.getInstance().position );
        this.directionalLight.direction.copyFrom( Camera.getInstance().position ).normalize(); 

        this.hemisphericLight.direction.copyFrom( Camera.getInstance().root.up );
        
        this.background.position.copyFrom( Camera.getInstance().position );
    }

}