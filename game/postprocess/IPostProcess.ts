/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPostProcess extends IConfigurable, ISingleton {

    readonly pipelines: any[];

    godrays( mesh: BABYLON.Mesh ): BABYLON.VolumetricLightScatteringPostProcess;

    atmosphere( planet: IPlanet ): AtmosphericScatteringPostProcess;

}