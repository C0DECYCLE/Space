/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetSurfaceObsticle extends EntityLOD implements IPlanetSurfaceObsticle {

    public config: IConfig = new Config(  

        [ "random", Math.random ]
    );

    private models: IModels;

    public constructor( game: IGame, obsticleKey: string, config: IConfig ) {

        super( game, ( instance: BABYLON.InstancedMesh, value: boolean ): void => { 

            this.game.star.shadow.cast( instance, false, value );  

        }, true );

        EngineUtils.configure( this, config );
        
        this.pickModels( obsticleKey );
        this.makeUnique();
        this.post();
    }

    private pickModels( obsticleKey: string ) {

        const variants: string[] = this.game.planets.obsticleKeys[ obsticleKey ];
        const variant: string = variants[ Math.round( variants.length * Math.random() ).clamp( 0, variants.length - 1 ) ];
        
        const models: IModels | undefined = this.game.planets.obsticles.get( obsticleKey )?.get( variant );

        if ( models !== undefined ) {

            this.models = models;
            this.fromModels( this.models );
        }
    }

    private makeUnique() {

        this.rotationQuaternion.copyFrom( new BABYLON.Vector3( this.config.random() * 2 - 1, this.config.random() * 2 - 1, this.config.random() * 2 - 1 ).scaleInPlace( Math.PI ).toQuaternion() );
        this.scaling.scaleInPlace( 0.8 + this.config.random() * 0.4 );
    }

    private post(): void {

        this.setBounding( EngineUtils.createBoundingCache( this.models[0], this.scaling ) );
    }
    
}