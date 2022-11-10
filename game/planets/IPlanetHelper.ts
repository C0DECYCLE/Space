/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetHelper {

    readonly planet: IPlanet;

    get maskEnabled(): boolean;

    toggleShadow( value: boolean ): void;

    getOcclusionLimit( distance: float, correct?: float, limit?: float ): float;

    createBasicMaterial(): BABYLON.StandardMaterial;

}