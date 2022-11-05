/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetMaterial extends BABYLON.CustomMaterial {

    readonly planet: IPlanet;

    readonly colors: [ string, string, BABYLON.Color3 | BABYLON.Vector3 ][];

}