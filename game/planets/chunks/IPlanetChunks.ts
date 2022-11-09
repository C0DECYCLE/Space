/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetChunks {
    
    readonly planet: IPlanet;
    
    readonly nodes: Map< string, IPlanetChunksNode >;

    insertQuadtrees( distance: float ): void;

    node( params: IPlanetInsertParameters, dot: float, nodeKey: string, position: BABYLON.Vector3, fixRotationQuaternion: BABYLON.Quaternion, size: int, faceSize: int ): void;

    toggleShadows( value: boolean ): void;

}