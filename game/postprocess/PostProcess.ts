/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PostProcess implements IPostProcess {

    public config: IConfig = new Config(  

        [ "samples", 3 ]
    );

    public readonly game: IGame;
    public readonly scene: BABYLON.Scene;
    public readonly camera: BABYLON.Camera;

    public readonly pipelines: any[] = [];

    public constructor( game: IGame, config: IConfig ) {

        this.game = game;
        this.scene = this.game.scene;
        this.camera = this.game.camera.camera;

        EngineUtils.configure( this, config );

        this.scene.clearColor = this.scene.clearColor.toLinearSpace();

        this.defaultPipeline();
    }

    public godrays( mesh: BABYLON.Mesh ): BABYLON.VolumetricLightScatteringPostProcess {

        const postprocess: BABYLON.VolumetricLightScatteringPostProcess = new BABYLON.VolumetricLightScatteringPostProcess( `${ mesh.name }_godrays`, 1.0, this.camera, mesh, 60, BABYLON.Texture.BILINEAR_SAMPLINGMODE, this.game.engine.babylon, false );
        postprocess.weight = 0.15;

        this.pipelines.push( postprocess );

        return postprocess;
    }

    public atmosphere( planet: IPlanet ): AtmosphericScatteringPostProcess {

        const postprocess: AtmosphericScatteringPostProcess = new AtmosphericScatteringPostProcess( `${ planet.root.name }_atmosphere`, planet, this.game.star, this.game.camera, this.scene );

        postprocess.settings.redWaveLength = planet.config.waveLengths.r;
        postprocess.settings.greenWaveLength = planet.config.waveLengths.g;
        postprocess.settings.blueWaveLength = planet.config.waveLengths.b;

        this.pipelines.push( postprocess );

        return postprocess;
    }

    private defaultPipeline(): void {

        const pipeline: BABYLON.DefaultRenderingPipeline = new BABYLON.DefaultRenderingPipeline( "postprocess_default", true, this.scene, [ this.camera ] );
        pipeline.samples = this.config.samples;
        pipeline.chromaticAberrationEnabled = true;
        pipeline.chromaticAberration.radialIntensity = 1;
        pipeline.chromaticAberration.aberrationAmount = 30;

        this.pipelines.push( pipeline );
    }

}