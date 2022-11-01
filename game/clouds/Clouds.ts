/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Clouds implements IClouds {

    public static readonly lods: number[][] = [

        [ 7, 0.25 ],
        [ 4, 0.1 ],
        [ 2, AbstractLOD.minimum ]
    ];

    public config: IConfig = new Config(  

    );

    public readonly game: IGame;
    public readonly scene: BABYLON.Scene;
    
    public readonly materials: Map< string, ICloudMaterial > = new Map< string, ICloudMaterial >();
    public readonly list: ICloudsDistributer[] = [];

    public constructor( game: IGame, config: IConfig ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure( this, config );
    }

    public createModels( blueprints: number[][], material: ICloudMaterial ): ICloudModel[] {

        const models: ICloudModel[] = [];

        for ( let i: number = 0; i < blueprints.length; i++ ) {

            models.push( this.createModel( i, blueprints[i][0], blueprints[i][1], material ) );
        }

        return models;
    }

    private createModel( level: number, subdivisions: number, min: number, material: ICloudMaterial ): ICloudModel {

        const mesh: ICloudModel = new CloudModel( this, level, subdivisions, min, material );

        mesh.parent = this.game.scene.assets.cache;
        mesh.setEnabled( false );

        const invMin: number = Math.round( 1 / AbstractLOD.getMinimum( mesh.name ) );
            
        mesh.entitymanager = new EntityManager( mesh.name, this.scene, () => this.game.scene.assets.instance( mesh, ( _instance: BABYLON.InstancedMesh ): void => {} ), invMin * 4, invMin );

        return mesh;
    }


}