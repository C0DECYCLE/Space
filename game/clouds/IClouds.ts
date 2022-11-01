/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IClouds extends IConfigurable {

    readonly game: IGame;
    
    readonly scene: BABYLON.Scene;
    
    readonly materials: Map< string, ICloudMaterial >;

    readonly list: ICloudsDistributer[];

    createModels( blueprints: number[][], material: ICloudMaterial ): ICloudModel[];

}