/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Planets implements IPlanets {

    /* Singleton */ 
    private static instance: IPlanets; 
    public static instantiate(): void { if ( this.instance === undefined ) this.instance = new Planets(); } 
    public static getInstance(): IPlanets { return this.instance; }

    public config: IConfig = new Config(  

    );

    public readonly list: IPlanet[] = [];

    public readonly obsticles: Map< string, Map< string, IModels > > = new Map< string, Map< string, IModels > >();
    public readonly obsticleKeys: IConfig = new Config( 

        [ "tree", [ "a" ] ] 
    );

    private maskMaterial: BABYLON.StandardMaterial;

    private constructor() {
        
        this.createMaskMaterial();
        this.setupObsticles();
    }

    public register( config: IConfig ): void {

        this.list.push( new Planet( config ) );
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
            const distance: number = Camera.getInstance().getScreenDistance( planet.root );
            const planetThreashold: number = planet.config.radius + planet.config.influence;
            
            //Player.getInstance().planetInsert( planet, distance, planetThreashold );
            Spaceships.getInstance().planetInsert( planet, distance, planetThreashold );
           
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

        this.maskMaterial = new BABYLON.StandardMaterial( "planet_mask_material", Space.scene );
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
        
        return Space.scene.assets.provide( `${ obsticleKey }-${ variant }`, ( mesh: BABYLON.Mesh, i: number ): void => {
            
            if ( i === 0 ) {

                Star.getInstance().shadow.receive( mesh, false, true );
            } 
        } );
    }

}