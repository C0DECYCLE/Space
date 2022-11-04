/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Spaceships implements ISpaceships {

    public config: IConfig = new Config(  

    );

    public readonly game: IGame;
    public readonly scene: BABYLON.Scene;

    public readonly list: ISpaceship[] = [];

    public constructor( game: IGame, config: IConfig ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure( this, config );

        this.setupVariants();
    }

    public register( variant: string, config: IConfig ): void {

        let spaceship: ISpaceship | null = null;

        switch ( variant ) {

            case "vulcan": spaceship = new VulcanSpaceship( this.game, config ); break;
        }

        if ( spaceship !== null ) {

            this.list.push( spaceship );
        }
    }

    public update(): void {

        for ( let i: number = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }
    
    public planetInsert( planet: IPlanet, distance: number, planetThreashold: number ): void {

        for ( let i: number = 0; i < this.list.length; i++ ) {

            this.list[i].planetInsert( planet, distance, planetThreashold );
        }
    }

    private setupVariants(): void {
        
        this.load( VulcanSpaceship.models, "Vulcan", VulcanSpaceship.interactables );
    }

    private load( target: IModels, name: string, interactables: string[] ): void {
        
        const importLods: BABYLON.Mesh[] = this.game.scene.assets.list.get( `spaceship-${ name.toLowerCase() }` )?.getChildren() || [];
        
        for ( let i: number = 0; i < importLods.length; i++ ) {
            
            const model: BABYLON.Mesh = this.game.scene.assets.traverse( importLods[i], mesh => {
            
                if ( i === 0 ) {

                    this.game.star.shadow.receive( mesh, false, true );
                }
            }, interactables );
            
            //model = game.scene.assets.merge( model );
            //game.star.shadow.receive( model, false, true );
            
            target.push( model );
        }
    }

}