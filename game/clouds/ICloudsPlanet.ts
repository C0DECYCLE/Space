/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ICloudsPlanet extends ICloudsDistributer {

    readonly clouds: IClouds;

    readonly list: ICloud[];

    material: ICloudMaterial;

    models: ICloudModel[];

    update( distance: number ): void;
    
}