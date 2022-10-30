/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroids implements IAsteroids {

    public config: IConfig = new Config(

    );

    public readonly game: IGame;
    public readonly scene: BABYLON.Scene;

    public readonly variants: Map< string, IModels > = new Map< string, IModels >();
    public readonly list: IAsteroidsDistributer[] = [];

    private readonly variantKeys: string[] = [ "a", "b", "c" ];

    public constructor( game: IGame, config: IConfig ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure( this, config );

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
        
        const models: IModels = new Models();
        const importLods: BABYLON.Mesh[] = this.scene.assets.list.get( `asteroid-${ variant }` )?.getChildren() || [];
        
        for ( let i: number = 0; i < importLods.length; i++ ) {
            
            const model: BABYLON.Mesh = this.scene.assets.traverse( importLods[i], ( mesh: BABYLON.Mesh ) => {
            
                if ( i === 0 ) {

                    this.game.star.shadow.receive( mesh, false, true );
                } 
            } );

            const invMin: number = Math.round( 1 / AbstractLOD.getMinimum( model.name ) );
            
            model.entitymanager = new EntityManager( model.name, this.scene, (): BABYLON.InstancedMesh => this.scene.assets.instance( model, ( mesh: BABYLON.Mesh ): void => {} ), invMin * 4, invMin );
            models.push( model );
        }

        return models;
    }

}