/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Planets implements IPlanets {

    public config: IConfig = new Config(  

    );

    public readonly game: IGame;
    public readonly scene: BABYLON.Scene;
    public readonly camera: ICamera;
    public readonly player: IPlayer;
    public readonly spaceships: ISpaceships;

    public readonly list: IPlanet[] = [];

    public readonly obsticles: Map< string, Map< string, IModels > > = new Map< string, Map< string, IModels > >();
    public readonly obsticleKeys: IConfig = new Config( 

        [ "tree", [ "a" ] ] 
    );

    private maskMaterial: BABYLON.StandardMaterial;

    public constructor( game: IGame, config: IConfig ) {
        
        this.game = game;
        this.scene = this.game.scene;
        this.camera = this.game.camera;
        this.player = this.game.player;
        this.spaceships = this.game.spaceships;

        EngineUtils.configure( this, config );
        
        this.createMaskMaterial();
        this.setupObsticles();
    }

    public register( config: IConfig ): void {

        this.list.push( new Planet( this.game, config ) );
    }

    public registerFromConfigs( configs: IConfig[] ): void {

        for ( let i: number = 0; i < configs.length; i++ ) {

            this.register( configs[i] );
        }
    }

    public getMaskMaterial(): BABYLON.StandardMaterial {

        return this.maskMaterial;
    }

    public update(): void { //if ( window.freeze === true ) return;

        this.insert();
        this.updatePlanets();
    }

    private insert(): void {

        for ( let i: number = 0; i < this.list.length; i++ ) {

            const planet: IPlanet = this.list[i];
            const distance: number = this.camera.getScreenDistance( planet.root );
            const planetThreashold: number = planet.config.radius + planet.config.influence;
            
            this.player.planetInsert( planet, distance, planetThreashold );
            this.spaceships.planetInsert( planet, distance, planetThreashold );
           
            planet.helper.toggleShadow( distance < planet.config.radius * 5 );
            planet.insert( distance );
        }
    }

    private updatePlanets(): void {

        for ( let i: number = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    private createMaskMaterial(): void {

        this.maskMaterial = new BABYLON.StandardMaterial( "planet_mask_material", this.scene );
        this.maskMaterial.disableLighting = true;
        
        this.maskMaterial.diffuseColor = new BABYLON.Color3( 0, 0, 0 );
        this.maskMaterial.specularColor = new BABYLON.Color3( 0, 0, 0 );
        this.maskMaterial.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        this.maskMaterial.ambientColor = new BABYLON.Color3( 0, 0, 0 );

        this.maskMaterial.freeze();
    }

    private setupObsticles(): void {
        
        const keys: string[] = Object.keys( this.obsticleKeys );

        for ( let i: number = 0; i < keys.length; i++ ) {

            this.setupObsticle( keys[i] );
        }
    }
    
    private setupObsticle( obsticleKey: string ): void {

        const target: Map< string, IModels > = new Map< string, IModels >();

        for ( let i: number = 0; i < this.obsticleKeys[ obsticleKey ].length; i++ ) {

            target.set( this.obsticleKeys[ obsticleKey ][i], this.setupModels( obsticleKey, this.obsticleKeys[ obsticleKey ][i] ) );
        }

        this.obsticles.set( obsticleKey, target );
    }

    private setupModels( obsticleKey: string, variant: string ): IModels {
        
        return this.scene.assets.provide( `${ obsticleKey }-${ variant }`, ( mesh: BABYLON.Mesh, i: number ): void => {
            
            if ( i === 0 ) {

                this.game.star.shadow.receive( mesh, false, true );
            } 
        } );
    }

}