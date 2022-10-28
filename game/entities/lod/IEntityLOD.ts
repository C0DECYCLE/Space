/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IEntityLOD extends IAbstractLOD {

    readonly levels: [ IEntityManager< BABYLON.InstancedMesh >, number ][];

    readonly position: BABYLON.Vector3;

    readonly rotationQuaternion: BABYLON.Quaternion;

    readonly scaling: BABYLON.Vector3;

    parent: BABYLON.Node | null;

    fromModels( models: IModels ): void;

    setBounding( boundingCache: IBoundingCache ): void;

    getInstance(): BABYLON.InstancedMesh | null;

    update(): void;

}