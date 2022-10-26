/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroid extends EntityLOD implements IAsteroids, IConfigurable {

    public config: IConfig = new Config(  

        [ "random", Math.random ] 
    );

    private variantKey: string;
    private models: IModels;

    public constructor( game: IGame, config: IConfig ) {

        super( game, ( instance: BABYLON.InstancedMesh, value: boolean ): void => { 

            game.star.shadow.cast( instance, value );  

        }, true );

        EngineUtils.configure( this, config );
        
        this.pickVariant();
        this.createModels();   
        this.makeUnique();
        this.post();
    }

    private pickVariant(): void {

        const variants: string[] = this.game.asteroids.variants.keys;
        
        this.variantKey = variants[ Math.round( variants.length * Math.random() ).clamp( 0, variants.length - 1 ) ];
        this.models = this.game.asteroids.variants[ this.variantKey ];
    }

    private createModels(): void {

        this.fromModels( this.models );
    }

    private makeUnique(): void {

        this.rotationQuaternion.copyFrom( new BABYLON.Vector3( this.config.random() * 2 - 1, this.config.random() * 2 - 1, this.config.random() * 2 - 1 ).scaleInPlace( Math.PI ).toQuaternion() );
        this.scaling.scaleInPlace( 0.8 + this.config.random() * 0.4 );
    }

    private post(): void {

        this.setBounding( EngineUtils.createBoundingCache( this.models[0], this.scaling ) );
    }
    
}