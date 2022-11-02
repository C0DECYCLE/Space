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

    public readonly variants: Map< string, Spaceship > = new Map()< string, Spaceship >;
    public readonly list: ISpaceship[] = [];

    public constructor( game: IGame, config: IConfig ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure( this, config );

        this.setupVariants();
    }

    public register( variant: string, config: IConfig ): void {

        const variantClass: Spaceship = this.variants.get( variant );

        this.list.push( new variantClass( this.game, config ) );
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
        
        this.setupVariant( VulcanSpaceship );
    }

    private setupVariant( variantClass: Spaceship ): void {

        variantClass.load( this.game );
        this.variants.set( variantClass.name.toLowerCase(), variantClass );
    }

}