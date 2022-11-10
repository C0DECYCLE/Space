/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetInsertParameters {

    readonly distanceCenterInsertion: float;

    readonly distanceRadiusFactor: float;

    readonly centerToInsertion: BABYLON.Vector3;
    
    readonly occlusionFallOf: float;

}