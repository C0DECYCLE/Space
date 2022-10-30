/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IAsteroidsDistributer extends IConfigurable {

    readonly game: IGame;

    readonly scene: BABYLON.Scene;

    readonly list: any[];
    
    root: BABYLON.TransformNode;
    
    get position(): BABYLON.Vector3 | void;

    get rotationQuaternion(): BABYLON.Quaternion | void;

    get numberOfAsteroids(): number;

    update(): void;

}