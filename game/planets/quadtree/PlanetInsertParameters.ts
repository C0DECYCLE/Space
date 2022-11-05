/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetInsertParameters implements IPlanetInsertParameters {
    
    public readonly distanceCenterInsertion: number;
    public readonly distanceRadiusFactor: number;

    public readonly centerToInsertion: BABYLON.Vector3;
    public readonly occlusionFallOf: number;

    public constructor( planet: IPlanet, distance: number ) {
        
        this.distanceCenterInsertion = distance;
        this.distanceRadiusFactor = distance / planet.config.radius;
    
        this.centerToInsertion = planet.game.camera.position.subtract( planet.position ).normalize();
        this.occlusionFallOf = planet.helper.getOcclusionFallOf( distance, 0.9 );
    }
    
}