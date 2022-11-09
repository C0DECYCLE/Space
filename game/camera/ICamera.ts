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

    attachToSpaceship( spaceship: IAbstractSpaceship ): void;

    update(): void;

    getScreenDistance( source: BABYLON.Vector3 | BABYLON.TransformNode ): float;

    getScreenSquaredDistance( source: BABYLON.Vector3 | BABYLON.TransformNode ): float;

    getApproximateScreenDistance( source: BABYLON.TransformNode ): float;

    getScreenCoverage( node: BABYLON.TransformNode, size?: float ): float;

}