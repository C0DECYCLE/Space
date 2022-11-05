/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetHelper {

    readonly planet: IPlanet;

    get maskEnabled(): boolean;

    toggleShadow( value: boolean ): void;

    getOcclusionFallOf( distance: number, c?: number ): number;

    createBasicMaterial(): BABYLON.StandardMaterial;

}