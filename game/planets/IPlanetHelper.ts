/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetHelper {

    readonly planet: IPlanet;

    get maskEnabled(): boolean;

    toggleShadow( value: boolean ): void;

    getOcclusionFallOf( distance: float, c?: float ): float;

    createBasicMaterial(): BABYLON.StandardMaterial;

}