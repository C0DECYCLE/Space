/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetChunks {
    
    readonly planet: IPlanet;
    
    readonly nodes: Map< string, IPlanetChunksNode >;

    insertQuadtrees( distance: number ): void;

    node( params: IPlanetInsertParameters, dot: number, nodeKey: string, position: BABYLON.Vector3, fixRotationQuaternion: BABYLON.Quaternion, size: number, faceSize: number ): void;

    toggleShadows( value: boolean ): void;

}