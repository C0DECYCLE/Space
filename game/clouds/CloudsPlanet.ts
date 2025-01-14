/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudsPlanet extends AbstractEntitySpawnerPlanet implements ICloudsPlanet {

    public static readonly LOD_LIMIT: float = 2 ** 2.5;

    public override config: IConfig = {
        
        color: "#ffffff",
    
        cullScale: 0.00175,
        limit: 0.35,
        mainScale: 1.5,
        heightScale: 1.0
    };  

    public override readonly list: ICloud[] = [];

    public material: ICloudMaterial;
    public models: ICloudModel[];

    public constructor( planet: IPlanet, config?: IConfig ) {

        super( planet, config );

        EngineUtils.configure( this, config );

        this.setupModels();
        this.setupFilters();
        this.spawn();
        this.register();
    }

    protected create( position: BABYLON.Vector3, n: int, varyings: IVaryings ): [ ISpawnable, IVaryings ] {
        
        const height: float = this.noise( position.clone().scaleInPlace( this.planet.config.radius * -this.config.cullScale * 2.5 ).addInPlace( varyings.noiseOffset ) );
        
        const cloud: ICloud = new Cloud( this.models );
        cloud.position.copyFrom( position ).scaleInPlace( this.planet.config.radius + this.planet.config.maxHeight * (0.5 + height * 0.5) * this.config.heightScale );

        EngineUtils.setDirection( cloud.rotationQuaternion, cloud.position, 0, Math.PI / 2, 0 );
        EngineUtils.rotate( cloud.rotationQuaternion, BABYLON.Axis.Y, Math.random() * Math.PI * 2 );

        cloud.scaling.copyFromFloats( Math.random(), Math.random(), Math.random() ).scaleInPlace( 0.25 );
        cloud.scaling.addInPlaceFromFloats( 0.75, 0.5, 0.75 );
        cloud.scaling.scaleInPlace( 2 + varyings.cull * 3 ).scaleInPlace( 100 * this.config.mainScale );

        cloud.parent = this.planet.root;
        cloud.randomValue = Math.random() * n;
        cloud.ready();

        return [ cloud, {} ];
    }

    public update( distance: float ): void {

        if ( this.planet.lod.isVisible === true ) {

            this.updateClouds( distance );
        }
    }

    private setupModels(): void {

        this.material = Clouds.getInstance().materials.get( this.config.color ) || new CloudMaterial( Clouds.getInstance(), this.config.color );
        this.models = Clouds.getInstance().createModels( Clouds.lods, this.material );
    }

    private setupFilters(): void {

        this.addPreFilter( ( position: BABYLON.Vector3 ): false | IVaryings => this.cull_filter( position ) );
    }

    private cull_filter( position: BABYLON.Vector3 ): false | IVaryings {
        
        const noiseOffset: BABYLON.Vector3 = new BABYLON.Vector3( this.planet.position.x, this.config.seed, this.planet.position.z );
        const cull: float = this.noise( position.clone().scaleInPlace( this.planet.config.radius * this.config.cullScale ).addInPlace( noiseOffset ) );

        if ( cull < this.config.limit ) {

            return { noiseOffset: noiseOffset, cull: 1 - (cull / this.config.limit) };
        }

        return false;
    }

    private register(): void {

        Clouds.getInstance().list.push( this );
    }


    /////////////////////////////////////////////////////////////////

    private updateClouds( distance: float ): void {

        const radiusDistance: float = distance / this.planet.config.radius;
        const planetToCamera: BABYLON.Vector3 = Camera.getInstance().position.subtract( this.planet.position ).normalize();
        const occlusionLimit: float = this.planet.helper.getOcclusionLimit( distance, undefined, -0.35 );
        const distanceLODLevel: float = (radiusDistance / CloudsPlanet.LOD_LIMIT).clamp( 0, 1 );
        const starLightDirection: BABYLON.Vector3 = this.planet.position.normalizeToNew().applyRotationQuaternionInPlace( this.planet.rotationQuaternion.invert() );

        for ( let i: int = 0; i < this.list.length; i++ ) {

            this.updateLOD( this.list[i], radiusDistance, planetToCamera, occlusionLimit, distanceLODLevel );
            this.updateStarLight( this.list[i], starLightDirection );
        }
    }

    private updateLOD( cloud: ICloud, radiusDistance: float, planetToCamera: BABYLON.Vector3, occlusionLimit: float, distanceLODLevel: float ): void {

        const cloudWorld: BABYLON.Vector3 = BABYLON.Vector3.TransformCoordinates( cloud.position, this.planet.root._worldMatrix );
        const planetToCloud: BABYLON.Vector3 = cloudWorld.subtract( this.planet.position ).normalize(); //cache normal cloud direction
        const dot: float = BABYLON.Vector3.Dot( planetToCamera, planetToCloud );

        if ( dot > occlusionLimit ) {
            
            if ( radiusDistance < CloudsPlanet.LOD_LIMIT ) {

                cloud.set( Math.round( Math.round( cloud.levels.length * ((1 - dot) + distanceLODLevel) * 0.5 ).clamp( 0, cloud.levels.length - 1 ) ) );

            } else {

                cloud.set( cloud.levels.length - 1 );
            }

        } else {

            cloud.setEnabled( false );
        }
    }

    private updateStarLight( cloud: ICloud, starLightDirection: BABYLON.Vector3 ): void {

        if ( cloud.isVisible === true ) {
                
            cloud.updateStarLightDirection( starLightDirection );
        }
    }

}