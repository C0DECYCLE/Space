/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

abstract class AbstractEntitySpawnerPlanet implements IAbstractEntitySpawnerPlanet {

    public config: IConfig = new Config(  

        [ "seed", undefined ],

        [ "density", 0.0015 ]
    );

    public readonly planet: IPlanet;

    public readonly list: ISpawnable[] = [];

    private perlin: perlinNoise3d;

    private preFilters: TFilter[] = [];
    private postFilters: TFilter[] = [];

    protected constructor( planet: IPlanet, config?: IConfig ) {
        
        this.planet = planet;

        EngineUtils.configure( this, config );

        this.setupPerlin();
    }

    protected addPreFilter( prefilter: TFilter ): void {

        this.preFilters.push( prefilter );
    }

    protected addPostFilter( filter: TFilter ): void {

        this.postFilters.push( filter );
    }

    protected spawn(): void {

        const planetSurfaceArea: number = 4 * Math.PI * (this.planet.config.radius ** 2);
        const n: number = Math.floor( planetSurfaceArea * 0.01 * this.config.density );
        
        for ( let i: number = 0; i < n; i++ ) {

            this.evaluate( this.getPosition( i, n ), n );
        }
    }

    protected abstract create( _position: BABYLON.Vector3, _n: number, _varyings: IVaryings ): [ ISpawnable, IVaryings ];

    protected noise( input: number | BABYLON.Vector3 ): number {

        if ( input instanceof BABYLON.Vector3 ) {

            return this.perlin.get( input.x, input.y, input.z );
        }

        return this.perlin.get( input, input, input );
    }

    private setupPerlin(): void {

        this.config.seed = this.config.seed || this.planet.config.seed.y;

        this.perlin = new perlinNoise3d();
        this.perlin.noiseSeed( this.config.seed );
    }
    
    protected getPosition( i: number, n: number ): BABYLON.Vector3 {

        const theta: number = 2 * Math.PI * i / PHI;
        const phi: number = Math.acos( 1 - 2 * ( i + 0.5 ) / n );

        return new BABYLON.Vector3( Math.cos( theta ) * Math.sin( phi ), Math.sin( theta ) * Math.sin( phi ), Math.cos( phi ) ); 
    }

    private evaluate( position: BABYLON.Vector3, n: number ): void {

        const pretest: false | IVaryings = this.test( this.preFilters, [ position ] );

        if ( pretest instanceof Varyings ) {
            
            const creation: [ ISpawnable, IVaryings ] = this.create( position, n, pretest );

            if ( this.test( this.postFilters, creation ) instanceof Varyings ) {
            
                this.list.push( creation[0] );
            }
        }
    }

    private test( filter: TFilter[], args: any[] ): false | IVaryings {

        const varyings: IVaryings = new Varyings();

        for ( let i: number = 0; i < filter.length; i++ ) {

            const result: false | IVaryings = filter[i]( ...args );

            if ( result === false ) {

                return false;
            }

            Object.assign( varyings, result );
        }

        return varyings;
    }

}