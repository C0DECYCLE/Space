/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ICamera extends IConfigurable, ISingleton {

    root: BABYLON.TransformNode;

    camera: BABYLON.ArcRotateCamera;

    readonly state: IStateMachine;
    
    get position(): BABYLON.Vector3;

    get rotationQuaternion(): BABYLON.Quaternion;

    attachToPlayer( player: IPlayer ): void;

    attachToSpaceship( spaceship: ISpaceship ): void;

    update(): void;

    getScreenDistance( source: BABYLON.Vector3 | BABYLON.TransformNode ): number;

    getScreenSquaredDistance( source: BABYLON.Vector3 | BABYLON.TransformNode ): number;

    getApproximateScreenDistance( source: BABYLON.TransformNode ): number;

    getScreenCoverage( node: BABYLON.TransformNode, size?: number ): number;

}