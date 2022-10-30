/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPostProcess extends IConfigurable {

    readonly game: IGame;

    readonly scene: BABYLON.Scene;

    readonly camera: BABYLON.Camera;

    readonly pipelines: any[];

    godrays( mesh: BABYLON.Mesh ): BABYLON.VolumetricLightScatteringPostProcess;

    atmosphere( planet: IPlanet ): AtmosphericScatteringPostProcess;

}