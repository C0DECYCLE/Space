/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetInsertParameters implements IPlanetInsertParameters {
    
    public readonly distanceCenterInsertion: float;
    public readonly distanceRadiusFactor: float;

    public readonly centerToInsertion: BABYLON.Vector3;
    public readonly occlusionLimit: float;

    public constructor( planet: IPlanet, distance: float ) {
        
        this.distanceCenterInsertion = distance;
        this.distanceRadiusFactor = distance / planet.config.radius;
    
        this.centerToInsertion = Camera.getInstance().position.subtract( planet.position ).normalize();
        this.occlusionLimit = planet.helper.getOcclusionLimit( distance, 0.9 );
    }
    
}