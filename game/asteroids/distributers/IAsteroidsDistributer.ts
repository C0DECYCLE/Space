/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IAsteroidsDistributer extends IConfigurable {

    readonly list: any[];
    
    root: BABYLON.TransformNode;
    
    get position(): BABYLON.Vector3 | void;

    get rotationQuaternion(): BABYLON.Quaternion | void;

    get numberOfAsteroids(): int;

    update(): void;

}