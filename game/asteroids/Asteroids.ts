/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroids extends Singleton implements IAsteroids {

    public config: IConfig = new Config(

    );

    public readonly game: IGame;
    public readonly scene: BABYLON.Scene;

    public readonly variants: Map< string, IModels > = new Map< string, IModels >();
    public readonly list: IAsteroidsDistributer[] = [];

    private readonly variantKeys: string[] = [ "a", "b", "c" ];

    protected constructor() {

        super();

        this.game = Space;
        this.scene = this.game.scene;

        this.setupVariants();
    }

    public register( type: string, config: IConfig ): void {

        let asteroids: IAsteroidsDistributer | null = null;

        switch ( type ) {

            case "cluster": asteroids = new AsteroidsCluster( this.game, config ); break;

            case "ring": asteroids = new AsteroidsRing( this.game, config ); break;
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
        
        return this.scene.assets.provide( `asteroid-${ variant }`, ( mesh: BABYLON.Mesh, i: number ): void => {
            
            if ( i === 0 ) {

                this.game.star.shadow.receive( mesh, false, true );
            } 
        } );
    }

}