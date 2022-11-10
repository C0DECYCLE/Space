/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ICloud extends IEntityLOD, ISpawnable, IConfigurable {

    randomValue: float;

    readonly starLightDirection: BABYLON.Vector3;

    ready(): void;

    updateStarLightDirection( starLightDirection: BABYLON.Vector3 ): void;

}