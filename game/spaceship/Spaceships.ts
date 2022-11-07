/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Spaceships implements ISpaceships {

    /* Singleton */ 
    private static instance: ISpaceships; 
    public static instantiate(): void { if ( this.instance === undefined ) this.instance = new Spaceships(); } 
    public static getInstance(): ISpaceships { return this.instance; }
    
    public config: IConfig = new Config(  

    );

    public readonly list: ISpaceship[] = [];

    private constructor() {

        this.setupVariants();
    }

    public register( variant: string, config: IConfig ): void {

        let spaceship: ISpaceship | null = null;

        switch ( variant ) {

            case "vulcan": spaceship = new VulcanSpaceship( config ); break;
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
        
        const importLods: BABYLON.Mesh[] = EngineAssets.getInstance().list.get( `spaceship-${ name.toLowerCase() }` )?.getChildren() || [];
        
        for ( let i: number = 0; i < importLods.length; i++ ) {
            
            const model: BABYLON.Mesh = EngineAssets.getInstance().traverse( importLods[i], mesh => {
            
                if ( i === 0 ) {

                    Star.getInstance().shadow.receive( mesh, false, true );
                }
            }, interactables );
            
            //model = EngineAssets.getInstance().merge( model );
            //Star.getInstance().shadow.receive( model, false, true );
            
            target.push( model );
        }
    }

}