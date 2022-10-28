/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IEngine {

    canvas: HTMLCanvasElement;

    babylon: BABYLON.Engine;

    screenSize: BABYLON.Vector2;

    readonly stats: Stats[];
    
    get deltaCorrection(): number;

    set( update: ( delta: number ) => void ): void;

}