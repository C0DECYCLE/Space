/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Planet implements IPlanet {

    public config: IConfig = {

        key: UUIDv4(),
        radius: 2048,
        spin: false,
    
        influence: 512,
        maxHeight: 512 * 0.75,
        gravity: 0.8,
    
        atmosphere: 512,
        waveLengths: new BABYLON.Color3( 700, 530, 440 ),
        clouds: false,
    
        min: 64,
        resolution: 24,
    
        seed: null,
        variant: PlanetUtilsHeightmap.VARIANTS.DEFAULT,
        mountainy: 7.5,
        warp: 0.3,
    
        colors: {
    
            main: "#7e7e7e",
            steep: "#222222"
        },
    
        surface: false
    };

    public root: BABYLON.TransformNode;
    public lod: ILOD;
    public physics: IPlanetPhysics;

    public helper: IPlanetHelper;
    //public stitch: IPlanetStitch;
    public material: IPlanetMaterial;
    public perlin: perlinNoise3d;
    public atmosphere: IAtmosphericScatteringPostProcess;
    public clouds: ICloudsPlanet;
    public surface: IPlanetSurface;

    public faces: Map< string, IPlanetQuadtree > = new Map< string, IPlanetQuadtree >();
    public chunks: IPlanetChunks;
    
    public get position(): BABYLON.Vector3 {
        
        return this.root.position;
    }

    public get rotationQuaternion(): BABYLON.Quaternion {
        
        if ( this.root.rotationQuaternion === null ) {

            this.root.rotationQuaternion = this.root.rotation.toQuaternion();
        }

        return this.root.rotationQuaternion;
    }

    private cachedInsertionString: string = "";
    private oversteppedInsertLimit: boolean = false;
    private orbitCenter: BABYLON.Vector3 = new BABYLON.Vector3( 0, 0, 0 );
    private distanceInOrbit: number = 0;
    private angleAroundOrbit: number = 0;

    public constructor( config?: IConfig ) {

        EngineUtils.configure( this, config );

        this.createRoot();
        this.createLod();
        this.setupGeneration();
        this.setupPerlin();
        this.setupPhysics();
        this.addAtmosphere();
        this.farInsertion();
        this.addClouds();
        this.setupSurface();
    }

    public place( orbitCenter: BABYLON.Vector3, distanceInOrbit: number, angleAroundOrbit: number ): void {

        this.orbitCenter = orbitCenter;
        this.distanceInOrbit = distanceInOrbit;
        this.angleAroundOrbit = angleAroundOrbit * EngineUtils.toRadian;

        this.position.copyFromFloats( Math.cos( this.angleAroundOrbit ), 0, Math.sin( this.angleAroundOrbit ) )
        .scaleInPlace( this.distanceInOrbit )
        .addInPlace( this.orbitCenter );
    }

    public insert( distance: number, force: boolean = false ): void {

        this.updateAtmosphereDensity( distance );

        if ( force === true ) {

            this.evalInsertionWithString( distance );
            return;
        }

        if ( distance / this.config.radius > PlanetQuadtree.INSERT_LIMIT ) {

            if ( this.oversteppedInsertLimit === false ) {
                
                this.oversteppedInsertLimit = true;
                this.root.computeWorldMatrix( true );
                //two times: first time removes half limit resolution chunk, second makes the lowest resolution chunk for outside of the limit
                this.chunks.insertQuadtrees( distance );
                this.chunks.insertQuadtrees( distance );
            }
            
        } else {

            this.oversteppedInsertLimit = false;
            this.evalInsertionWithString( distance );
        }
    }

    public update(): void {

        this.lod.update();
        this.updateSpin();
    }

    private createRoot(): void {

        this.root = new BABYLON.TransformNode( `planets_planet${ this.config.key }`, scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();

        UI.getInstance().registerMarker( this.root, { type: "travel" } );
    }

    private createLod(): void {

        this.lod = new LOD();
        this.lod.fromSingle( this.root );
    }

    private setupGeneration(): void {

        this.helper = new PlanetHelper( this, this.faces );
        //this.stitch = new PlanetQuadtreeStitch( this );
        this.chunks = new PlanetChunks( this );
        //this.material = this.helper.createBasicMaterial();
        this.material = new PlanetMaterial( this );
    }

    private setupPerlin(): void {

        this.perlin = new perlinNoise3d();
        this.perlin.noiseSeed( this.config.seed.x );
    }

    private setupPhysics(): void {

        this.physics = new PlanetPhysics( this );
    }

    private addAtmosphere(): void {

        if ( this.config.atmosphere !== false ) {

            this.atmosphere = PostProcess.getInstance().atmosphere( this );
        }
    }

    private farInsertion(): void {
        
        const farFarAway = EngineUtils.getFarAway();
        this.insert( farFarAway.y, true );
        
        EngineUtils.getBounding( this.root, true );
    }

    private addClouds(): void {

        if ( this.config.clouds !== false ) {

            this.clouds = new CloudsPlanet( this, this.config.clouds );
        }
    }
    
    private setupSurface(): void {

        if ( this.config.surface !== false ) {

            this.surface = new PlanetSurface( this, this.config.surface );
        }
    }
    
    private updateClouds( distance: number ): void {

        if ( this.clouds !== undefined ) {

            this.clouds.update( distance );
        }
    }

    private updateAtmosphereDensity( distance: number ): void {

        if ( this.config.atmosphere !== false ) {

            if ( this.lod.isVisible === false ) {

                if ( this.atmosphere.settings.densityModifier !== 0 ) {
    
                    this.atmosphere.settings.densityModifier = 0;
                }
            
            } else {

                const distanceCenterInfluence: number = this.config.radius + this.config.maxHeight;
                const distanceToInfluence: number = distance - distanceCenterInfluence;
                const distanceInfluenceLimit: number = ( PlanetQuadtree.INSERT_LIMIT * this.config.radius ) - distanceCenterInfluence;

                this.atmosphere.settings.densityModifier = ( 1 - ( ( distanceToInfluence / distanceInfluenceLimit ).clamp( 0, 1 ) * 0.8 ) );
            }
        }
    }
    
    private updateSurface( distance: number ): void {
        
        if ( this.surface !== undefined ) {

            this.surface.update( distance );
        }
    }

    private updateSpin(): void {
        
        if ( this.config.spin !== false ) {

            const deltaCorrection: number = Engine.getInstance().deltaCorrection;

            this.root.rotate( BABYLON.Axis.Y, this.config.spin * EngineUtils.toRadian * deltaCorrection, BABYLON.Space.LOCAL ); //make very movement speed * delta time
        }
    }
    
    private evalInsertionWithString( distance: number ): void {

        this.root.computeWorldMatrix( true );
        const insertionString: string = this.getInsertionString();
        
        if ( insertionString !== this.cachedInsertionString ) {
            
            this.chunks.insertQuadtrees( distance );
            this.updateSurface( distance );
            this.updateClouds( distance );
            
            this.cachedInsertionString = insertionString;
        }
    }

    private getInsertionString(): string {

        const rdez: number = 10;
        const diffrence: BABYLON.Vector3 = Camera.getInstance().position.subtract( BABYLON.Vector3.TransformCoordinates( BABYLON.Vector3.One().scaleInPlace( this.config.radius ), this.root._worldMatrix ) );
        diffrence.copyFromFloats( Math.round( diffrence.x / rdez ) * rdez,  Math.round( diffrence.y / rdez ) * rdez, Math.round( diffrence.z / rdez ) * rdez );

        return diffrence.toString();
    }

}