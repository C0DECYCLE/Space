/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroid extends EntityLOD implements IAsteroid {

    public config: IConfig = {

        random: Math.random
    };

    private variantKey: string;
    private models: IModels;

    public constructor( config?: IConfig ) {

        super( ( instance: BABYLON.InstancedMesh, value: boolean ): void => { 

            Star.getInstance().shadow.cast( instance, false, value );  

        }, true );
        
        EngineUtils.configure( this, config );
        
        this.pickVariant();
        this.fromModels( this.models );
        this.makeUnique();
        this.post();
    }

    private pickVariant(): void {

        const variants: string[] = [ ...Asteroids.getInstance().variants.keys() ];
        
        this.variantKey = variants[ Math.round( variants.length * Math.random() ).clamp( 0, variants.length - 1 ) ];
        
        const models: IModels | undefined = Asteroids.getInstance().variants.get( this.variantKey );

        if ( models !== undefined ) {

            this.models = models;
        }
    }

    private makeUnique(): void {

        this.rotationQuaternion.copyFrom( new BABYLON.Vector3( this.config.random() * 2 - 1, this.config.random() * 2 - 1, this.config.random() * 2 - 1 ).scaleInPlace( Math.PI ).toQuaternion() );
        this.scaling.scaleInPlace( 0.8 + this.config.random() * 0.4 );
    }

    private post(): void {

        if ( this.models[0] instanceof BABYLON.TransformNode ) {

            this.setBounding( EngineUtils.createBoundingCache( this.models[0], this.scaling ) );
        }
    }
    
}