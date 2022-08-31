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

    game = null;
    scene = null;
    camera = null;

    pipelines = [];

    #depthRenderer = null;
    #depthMap = null;

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;
        this.camera = this.game.camera.camera;

        EngineUtils.configure( this.config, config );

        this.scene.clearColor = this.scene.clearColor.toLinearSpace();

        this.#createDepthRenderer();
        this.#defaultPipeline();
    }

    register( mesh ) {

        this.#depthMap.renderList.add( mesh );
    }

    dispose( mesh ) {

        this.#depthMap.renderList.delete( mesh );
    }

    godrays( mesh ) {

        const postprocess = new BABYLON.VolumetricLightScatteringPostProcess( `${ mesh.name }_godrays`, 1.0, this.camera, mesh, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, this.game.engine.babylon, false );
        postprocess.weight = 0.1;

        this.pipelines.push( postprocess );

        return postprocess;
    }

    athmosphere( planet ) {

        const postprocess = new AtmosphericScatteringPostProcess( `${ planet.root.name }_athmosphere`, planet, this.game.star, this.game.camera, this.#depthMap, this.scene );

        postprocess.settings.redWaveLength = planet.config.waveLengths.r;
        postprocess.settings.greenWaveLength = planet.config.waveLengths.g;
        postprocess.settings.blueWaveLength = planet.config.waveLengths.b;

        this.pipelines.push( postprocess );

        return postprocess;
    }

    #createDepthRenderer() {

        this.#depthRenderer = new BABYLON.DepthRenderer( this.scene );

        this.#depthMap = this.#depthRenderer.getDepthMap();
        this.#depthMap.renderList = new ObjectArray();

        this.scene.customRenderTargets.push( this.#depthMap );
    }

    #defaultPipeline() {

        const pipeline = new BABYLON.DefaultRenderingPipeline( "postprocess_default", true, this.scene, [ this.camera ] );
        pipeline.samples = this.config.samples;
        pipeline.chromaticAberrationEnabled = true;
        pipeline.chromaticAberration.radialIntensity = 1;
        pipeline.chromaticAberration.aberrationAmount = 30;

        this.pipelines.push( pipeline );
    }

}