/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanet extends IConfigurable {

    root: BABYLON.TransformNode;

    lod: ILOD;

    physics: IPlanetPhysics;

    helper: IPlanetHelper;

    //stitch: IPlanetStitch;

    material: IPlanetMaterial;

    perlin: perlinNoise3d;

    atmosphere: IAtmosphericScatteringPostProcess;

    clouds: ICloudsPlanet;

    surface: IPlanetSurface;

    faces: Map< string, IPlanetQuadtree >;

    chunks: IPlanetChunks;
    
    get position(): BABYLON.Vector3;

    get rotationQuaternion(): BABYLON.Quaternion;

    place( orbitCenter: BABYLON.Vector3, distanceInOrbit: number, angleAroundOrbit: number ): void;

    insert( distance: number, force?: boolean ): void;

    update(): void;

}