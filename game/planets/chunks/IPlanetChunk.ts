/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetChunk extends BABYLON.Mesh {

    readonly planet: IPlanet;
    
    get size(): number;

    get resolution(): number;
    
    //stitch( /*neighbors*/ ): void;

    toggleShadow( value: boolean ): void;

    dispose(): void;

}