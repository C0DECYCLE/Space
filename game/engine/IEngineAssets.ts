/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IEngineAssets {

    readonly game: IGame;

    readonly scene: BABYLON.Scene;

    cache: BABYLON.Node;

    readonly list: Map< ILoadConfig[ "key" ], BABYLON.TransformNode >;

    readonly materials: Map< string, BABYLON.StandardMaterial >;

    readonly interactableMaterials: Map< string, IPlayerInteractionMaterial >;

    readonly onLoadObservable: BABYLON.Observable< void >;
    
    load( list: ILoadConfig[] ): void;
        
    traverse( importLod: BABYLON.Mesh, onEveryMesh: ( mesh: BABYLON.Mesh ) => void, interactables?: string[] ): BABYLON.Mesh;

    merge( mesh: BABYLON.Mesh ): BABYLON.Mesh;

    instance( lod: BABYLON.Mesh, onEveryInstance?: ( instance: BABYLON.InstancedMesh ) => void ): BABYLON.InstancedMesh;

}