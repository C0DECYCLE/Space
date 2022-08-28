"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PostProcess {

    config = {

        samples: 3
    };

    manager = null;
    scene = null;
    camera = null;

    postprocesses = [];

    #depthRenderer = null;
    #depthMap = null;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;
        this.camera = this.manager.camera.camera;

        EngineUtils.configure( this.config, config );

        this.#createDepthRenderer();
    }

    register( mesh ) {

        this.#depthMap.renderList.push( mesh );
    }

    dispose( mesh ) {

        this.#depthMap.renderList.remove( mesh );
    }

    godrays( mesh ) {

        const postprocess = new BABYLON.VolumetricLightScatteringPostProcess( `${ mesh.name }_godrays`, 1.0, null, mesh, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, Space.engine.babylon, false, this.scene );
        postprocess.weight = 0.1;

        this.postprocesses.push( postprocess );

        return postprocess;
    }

    athmosphere( planet ) {

        const postprocess = new AtmosphericScatteringPostProcess( `${ planet.root.name }_athmosphere`, planet, this.manager.star, this.manager.camera, this.#depthMap, Space.engine.babylon );

        postprocess.settings.redWaveLength = planet.config.waveLengths.r;
        postprocess.settings.greenWaveLength = planet.config.waveLengths.g;
        postprocess.settings.blueWaveLength = planet.config.waveLengths.b;

        this.postprocesses.push( postprocess );

        return postprocess;
    }

    build() {

        const pipeline = new BABYLON.PostProcessRenderPipeline( Space.engine.babylon, "postprocess_pipeline" );
        const effect = new BABYLON.PostProcessRenderEffect( Space.engine.babylon, "postprocess_effect", () => this.postprocesses );
        
        pipeline.addEffect( effect );

        this.scene.postProcessRenderPipelineManager.addPipeline( pipeline );
        this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline( "postprocess_pipeline", this.camera );
        
        this.scene.clearColor = this.scene.clearColor.toLinearSpace();

        const pipeline2 = this.#defaultPipeline();
    }

    #createDepthRenderer() {

        this.#depthRenderer = new BABYLON.DepthRenderer( this.scene );

        this.#depthMap = this.#depthRenderer.getDepthMap();
        this.#depthMap.renderList = [];

        this.scene.customRenderTargets.push( this.#depthMap );
    }

    #defaultPipeline() {

        const pipeline = new BABYLON.DefaultRenderingPipeline( "postprocess_pipeline_image", true, this.scene, [ this.camera ] );
        //pipeline.samples = this.config.samples;

        pipeline.chromaticAberrationEnabled = true;
        pipeline.chromaticAberration.radialIntensity = 1;
        pipeline.chromaticAberration.aberrationAmount = 30;

        return pipeline;
    }

}