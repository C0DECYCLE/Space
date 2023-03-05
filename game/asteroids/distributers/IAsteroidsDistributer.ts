/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IAsteroidsDistributer extends IConfigurable {

    readonly list: any[];
    
    root: BABYLON.TransformNode;
    
    get position(): BABYLON.Vector3;

    get rotationQuaternion(): BABYLON.Quaternion;

    get numberOfAsteroids(): int;

    linkPlanet( planet: IPlanet ): void;
    
    update(): void;

}