/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Cloud extends EntityLOD implements ICloud {

    public config: IConfig = {
        
    };

    public randomValue: number = 0;
    public readonly starLightDirection: BABYLON.Vector3 = new BABYLON.Vector3();

    private readonly models: IModels;

    public constructor( models: IModels, config?: IConfig ) {

        super( undefined, false, ( instance: BABYLON.InstancedMesh ): void => this.onLODRequest( instance ) );

        this.models = models;
        
        EngineUtils.configure( this, config );
         
        this.fromModels( this.models );  
    }

    public post(): void {

        this.setBounding( EngineUtils.createBoundingCache( this.models[0], this.scaling ) );
    }

    public updateStarLightDirection( starLightDirection: BABYLON.Vector3 ): void {

        this.starLightDirection.copyFrom( starLightDirection );

        const instance: Nullable< BABYLON.InstancedMesh > = this.getInstance();

        if ( instance !== null ) {

            EngineUtilsShader.setInstanceAttribute( instance, "starLightDirection", this.starLightDirection );
        }
    }

    private onLODRequest( instance: BABYLON.InstancedMesh ): void {
        
        EngineUtilsShader.setInstanceAttribute( instance, "randomValue", this.randomValue );
        EngineUtilsShader.setInstanceAttribute( instance, "cloudPosition", this.position );
    }

}