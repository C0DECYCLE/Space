/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetSurface extends AbstractEntitySpawnerPlanet implements IPlanetSurface {

    public static readonly LOD_LIMIT: float = 2.0;

    public override config: IConfig = {

        density: 0.5,
        cullScale: 0.002,
        limit: 0.4
    };

    public override readonly list: IPlanetSurfaceObsticle[] = [];

    public constructor( planet: IPlanet, config?: IConfig ) {

        super( planet, config );

        EngineUtils.configure( this, config );

        this.setupFilters();
        this.spawn();
    }

    protected create( position: BABYLON.Vector3, _n: int, _varyings: IVaryings ): [ ISpawnable, IVaryings ] {
        
        const obsticle: IPlanetSurfaceObsticle = new PlanetSurfaceObsticle( "tree" );

        obsticle.position.copyFrom( PlanetUtils.displace( this.planet, position ) );
        EngineUtils.setDirection( obsticle.rotationQuaternion, obsticle.position, 0, Math.PI / 2, 0 );
        EngineUtils.rotate( obsticle.rotationQuaternion, BABYLON.Axis.Y, Math.random() * Math.PI * 2 );
        
        const left: BABYLON.Vector3 = PlanetUtils.displace( this.planet, BABYLON.Vector3.Left().scaleInPlace( 10 ).applyRotationQuaternionInPlace( obsticle.rotationQuaternion ).addInPlace( position ).normalize() ).subtractInPlace( position );
        const forward: BABYLON.Vector3 = PlanetUtils.displace( this.planet, BABYLON.Vector3.Forward().scaleInPlace( 10 ).applyRotationQuaternionInPlace( obsticle.rotationQuaternion ).addInPlace( position ).normalize() ).subtractInPlace( position );
        const steepUp: BABYLON.Vector3 = BABYLON.Vector3.Cross( left, forward ).normalize();

        EngineUtils.setDirection( obsticle.rotationQuaternion, steepUp, 0, Math.PI / 2, 0 );

        obsticle.parent = this.planet.root;

        return [ obsticle, { steepUp: steepUp } ];
    }

    public update( distance: float ): void {
        
        if ( this.planet.lod.isVisible === true ) {

            this.updateObsticles( distance );
        }
    }

    private setupFilters(): void {

        this.addPreFilter( ( position: BABYLON.Vector3 ): false | IVaryings => this.cull_filter( position ) );
        this.addPostFilter( ( obsticle: IPlanetSurfaceObsticle, varyings: IVaryings ): false | IVaryings => this.steep_filter( obsticle, varyings ) );
    }

    private cull_filter( position: BABYLON.Vector3 ): false | IVaryings {
        
        const noiseOffset: BABYLON.Vector3 = new BABYLON.Vector3( this.planet.position.x, this.config.seed, this.planet.position.z );
        const cull: float = this.noise( position.clone().scaleInPlace( this.planet.config.radius * this.config.cullScale ).addInPlace( noiseOffset ) );

        if ( cull < this.config.limit ) {

            return {};
        }

        return false;
    }

    private steep_filter( obsticle: IPlanetSurfaceObsticle, varyings: IVaryings ): false | IVaryings {

        const tooSteep: boolean = BABYLON.Vector3.Dot( varyings.steepUp, obsticle.position.normalizeToNew() ) > 0.95;

        return tooSteep === false ? false : {};
    }


    /////////////////////////////////////////////////////////////////
    
    private updateObsticles( distance: float ): void {

        const radiusDistance: float = distance / this.planet.config.radius;
        const planetToCamera: BABYLON.Vector3 = Camera.getInstance().position.subtract( this.planet.position ).normalize();
        const occlusionLimit: float = this.planet.helper.getOcclusionLimit( distance, undefined, 0.85 );
        const distanceLODLevel: float = (radiusDistance / PlanetSurface.LOD_LIMIT).clamp( 0, 1 );
        
        for ( let i: int = 0; i < this.list.length; i++ ) {

            this.updateLOD( this.list[i], radiusDistance, planetToCamera, occlusionLimit, distanceLODLevel );
        }
    }

    private updateLOD( obsticle: IPlanetSurfaceObsticle, radiusDistance: float, planetToCamera: BABYLON.Vector3, occlusionLimit: float, distanceLODLevel: float ): void {

        const obsticleWorld: BABYLON.Vector3 = BABYLON.Vector3.TransformCoordinates( obsticle.position, this.planet.root._worldMatrix );
        const planetToObsticle: BABYLON.Vector3 = obsticleWorld.subtract( this.planet.position ).normalize(); //cache normal cloud direction
        const dot: float = BABYLON.Vector3.Dot( planetToCamera, planetToObsticle );
        
        if ( dot > occlusionLimit && radiusDistance < PlanetSurface.LOD_LIMIT ) {
            
            obsticle.set( Math.round( Math.round( obsticle.levels.length * ((1 - dot) + distanceLODLevel) * 0.5 ).clamp( 0, obsticle.levels.length - 1 ) ) );

        } else {

            obsticle.setEnabled( false );
        }
    }
    
}