/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Clouds implements IClouds {

    /* Singleton */ 
        private static instance: IClouds; 
        public static instantiate(): void { if ( this.instance === undefined ) this.instance = new Clouds(); } 
        public static getInstance(): IClouds { return this.instance; }

        
    public static readonly lods: [ int, float ][] = [

        [ 7, 0.25 ],
        [ 4, 0.1 ],
        [ 2, AbstractLOD.minimum ]
    ];

    public config: IConfig = {
        
    };

    public readonly materials: Map< string, ICloudMaterial > = new Map< string, ICloudMaterial >();
    public readonly list: ICloudsDistributer[] = [];

    private constructor() {
        
    }

    public createModels( blueprints: [ int, float ][], material: ICloudMaterial ): ICloudModel[] {

        const models: ICloudModel[] = [];

        for ( let i: int = 0; i < blueprints.length; i++ ) {

            models.push( this.createModel( i, blueprints[i][0], blueprints[i][1], material ) );
        }

        return models;
    }

    private createModel( level: int, subdivisions: int, min: float, material: ICloudMaterial ): ICloudModel {

        const invMin: int = Math.round( 1 / AbstractLOD.getMinimum( min ) );
        const mesh: ICloudModel = new CloudModel( this, level, subdivisions, min, material );

        mesh.parent = EngineAssets.getInstance().cache;
        mesh.setEnabled( false );
        mesh.entitymanager = new EntityManager( mesh.name, () => EngineAssets.getInstance().instance( mesh, ( _instance: BABYLON.InstancedMesh ): void => {} ), invMin * 4, invMin );

        return mesh;
    }

}