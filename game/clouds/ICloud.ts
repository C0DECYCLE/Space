/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ICloud extends IEntityLOD, ISpawnable, IConfigurable {

    randomValue: number;

    readonly starLightDirection: BABYLON.Vector3;

    post(): void;

    updateStarLightDirection( starLightDirection: BABYLON.Vector3 ): void;

}