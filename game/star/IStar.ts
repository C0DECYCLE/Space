/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IStar extends IConfigurable {

    readonly game: IGame;

    readonly scene: BABYLON.Scene;

    directionalLight: BABYLON.DirectionalLight;

    hemisphericLight: BABYLON.HemisphericLight;

    mesh: BABYLON.Mesh;

    godrays: BABYLON.VolumetricLightScatteringPostProcess;

    shadow: IStarShadow;
    
    background: BABYLON.Mesh;
    
    get position(): BABYLON.Vector3;

    get rotationQuaternion(): BABYLON.Quaternion;

    get lightDirection(): BABYLON.Vector3;

    update(): void;

}