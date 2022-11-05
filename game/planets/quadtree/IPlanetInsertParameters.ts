/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetInsertParameters {

    readonly distanceCenterInsertion: number;

    readonly distanceRadiusFactor: number;

    readonly centerToInsertion: BABYLON.Vector3;
    
    readonly occlusionFallOf: number;

}