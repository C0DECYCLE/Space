/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IEngine {

    babylon: BABYLON.Engine;

    screenSize: BABYLON.Vector2;

    extensions: IEngineExtensions;

    stats: Stats[];
    
    get deltaCorrection(): number;

    set( update: ( delta: number ) => void ): void;

}