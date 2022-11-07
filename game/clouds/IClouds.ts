/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IClouds extends IConfigurable, ISingleton {
    
    readonly materials: Map< string, ICloudMaterial >;

    readonly list: ICloudsDistributer[];

    createModels( blueprints: number[][], material: ICloudMaterial ): ICloudModel[];

}