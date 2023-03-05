/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ICloudsPlanet extends ICloudsDistributer {

    readonly list: ICloud[];

    material: ICloudMaterial;

    models: ICloudModel[];

    update( distance: float ): void;
    
}