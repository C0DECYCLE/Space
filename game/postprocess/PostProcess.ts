/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PostProcess implements IPostProcess {

    /* Singleton */ 
    private static instance: IPostProcess; 
    public static instantiate(): void { if ( this.instance === undefined ) this.instance = new PostProcess(); } 
    public static getInstance(): IPostProcess { return this.instance; }
    
    public config: IConfig = new Config(  

        [ "samples", 3 ]
    );

    public readonly pipelines: any[] = [];

    private constructor() {

        Space.scene.clearColor = Space.scene.clearColor.toLinearSpace();

        this.defaultPipeline();
    }

    public godrays( mesh: BABYLON.Mesh ): BABYLON.VolumetricLightScatteringPostProcess {

        const postprocess: BABYLON.VolumetricLightScatteringPostProcess = new BABYLON.VolumetricLightScatteringPostProcess( `${ mesh.name }_godrays`, 1.0, Camera.getInstance().camera, mesh, 60, BABYLON.Texture.BILINEAR_SAMPLINGMODE, Space.engine.babylon, false );
        postprocess.weight = 0.15;

        this.pipelines.push( postprocess );

        return postprocess;
    }

    public atmosphere( planet: IPlanet ): AtmosphericScatteringPostProcess {

        const postprocess: AtmosphericScatteringPostProcess = new AtmosphericScatteringPostProcess( `${ planet.root.name }_atmosphere`, planet, Star.getInstance(), Camera.getInstance(), Space.scene );

        postprocess.settings.redWaveLength = planet.config.waveLengths.r;
        postprocess.settings.greenWaveLength = planet.config.waveLengths.g;
        postprocess.settings.blueWaveLength = planet.config.waveLengths.b;

        this.pipelines.push( postprocess );

        return postprocess;
    }

    private defaultPipeline(): void {

        const pipeline: BABYLON.DefaultRenderingPipeline = new BABYLON.DefaultRenderingPipeline( "postprocess_default", true, Space.scene, [ Camera.getInstance().camera ] );
        pipeline.samples = this.config.samples;
        pipeline.chromaticAberrationEnabled = true;
        pipeline.chromaticAberration.radialIntensity = 1;
        pipeline.chromaticAberration.aberrationAmount = 30;

        this.pipelines.push( pipeline );
    }

}