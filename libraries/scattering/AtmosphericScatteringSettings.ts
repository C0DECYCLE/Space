/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AtmosphericScatteringSettings implements IAtmosphericScatteringSettings {

    public falloffFactor: number;
    public intensity: number;
    public scatteringStrength: number;
    public densityModifier: number;

    public redWaveLength: number;
    public greenWaveLength: number;
    public blueWaveLength: number;

    constructor( falloffFactor: number, intensity: number, scatteringStrength: number, densityModifier: number, redWaveLength: number, greenWaveLength: number, blueWaveLength: number ) {

        this.falloffFactor = falloffFactor;
        this.intensity = intensity;
        this.scatteringStrength = scatteringStrength;
        this.densityModifier = densityModifier;

        this.redWaveLength = redWaveLength;
        this.greenWaveLength = greenWaveLength;
        this.blueWaveLength = blueWaveLength;
    }
    
}