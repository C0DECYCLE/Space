/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AtmosphericScatteringPostProcess extends BABYLON.PostProcess implements IAtmosphericScatteringPostProcess {

    public settings: IAtmosphericScatteringSettings = new AtmosphericScatteringSettings( 15, 15, 1, 1, 700, 530, 440 );

    private readonly planet: Planet;
    private readonly star: Star;
    private readonly camera: BABYLON.Camera;
    private readonly depthMap: BABYLON.RenderTargetTexture;

    private readonly planetRadius: number;
    private readonly atmosphereRadius: number;

    public constructor( name: string, planet: Planet, star: Star, camera: Camera, scene: BABYLON.Scene ) {
        
        super( name, "../libraries/scattering/atmosphericScattering", [

            "sunPosition",
            "cameraPosition",

            "projection",
            "view",
            "cameraNear",
            "cameraFar",

            "planetPosition",
            "planetRadius",
            "atmosphereRadius",

            "falloffFactor",
            "sunIntensity",
            "scatteringStrength",
            "densityModifier",

            "redWaveLength",
            "greenWaveLength",
            "blueWaveLength"

        ], [

            "textureSampler",
            "depthSampler",

        ], 1, camera.camera, BABYLON.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine() );

        this.planet = planet;
        this.star = star;
        this.camera = camera;
        this.depthMap = scene.enableDepthRenderer().getDepthMap();

        this.planetRadius = planet.config.radius - planet.config.atmosphere * 1;
        this.atmosphereRadius = planet.config.radius + planet.config.atmosphere * 2;
        
        this.onApply = effect => this.applyEffect( effect );
    }

    private applyEffect( effect: BABYLON.Effect ): void {

        effect.setTexture( "depthSampler", this.depthMap );
        
        effect.setVector3( "sunPosition", this.star.position );
        effect.setVector3( "cameraPosition", this.camera.camera.globalPosition );
        effect.setVector3( "planetPosition", this.planet.position );

        effect.setMatrix( "projection", this.camera.camera.getProjectionMatrix() );
        effect.setMatrix( "view", this.camera.camera.getViewMatrix() );
        effect.setFloat( "cameraNear", this.camera.camera.minZ );
        effect.setFloat( "cameraFar", this.camera.camera.maxZ );

        effect.setFloat( "planetRadius", this.planetRadius );
        effect.setFloat( "atmosphereRadius", this.atmosphereRadius );

        effect.setFloat( "falloffFactor", this.settings.falloffFactor );
        effect.setFloat( "sunIntensity", this.settings.intensity );
        effect.setFloat( "scatteringStrength", this.settings.scatteringStrength );
        effect.setFloat( "densityModifier", this.settings.densityModifier );

        effect.setFloat( "redWaveLength", this.settings.redWaveLength );
        effect.setFloat( "greenWaveLength", this.settings.greenWaveLength );
        effect.setFloat( "blueWaveLength", this.settings.blueWaveLength );
    }

}