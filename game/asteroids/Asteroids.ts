/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroids implements IAsteroids {

    /* Singleton */ 
    private static instance: IAsteroids; 
    public static instantiate(): void { if ( this.instance === undefined ) this.instance = new Asteroids(); } 
    public static getInstance(): IAsteroids { return this.instance; }

    public config: IConfig = {
        
    };

    public readonly variants: Map< string, IModels > = new Map< string, IModels >();
    public readonly list: IAsteroidsDistributer[] = [];

    private readonly variantKeys: string[] = [ "a", "b", "c" ];

    private constructor() {

        this.setupVariants();
    }

    public register( type: string, config?: IConfig ): void {

        let asteroids: Nullable< IAsteroidsDistributer > = null;

        switch ( type ) {

            case "cluster": asteroids = new AsteroidsCluster( config ); break;

            case "ring": asteroids = new AsteroidsRing( config ); break;
        }

        if ( asteroids !== null ) {

            this.list.push( asteroids );
        }
    }

    public update(): void {

        for ( let i: number = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    private setupVariants(): void {

        for ( let i: number = 0; i < this.variantKeys.length; i++ ) {

            this.variants.set( this.variantKeys[i], this.setupModels( this.variantKeys[i] ) );
        }
    }

    private setupModels( variant: string ): IModels {
        
        return EngineAssets.getInstance().provide( `asteroid-${ variant }`, ( mesh: BABYLON.Mesh, i: number ): void => {
            
            if ( i === 0 ) {

                Star.getInstance().shadow.receive( mesh, false, true );
            } 
        } );
    }

}