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

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;
        this.camera = this.game.camera.camera;

        EngineUtils.configure.call( this, config );

        this.scene.clearColor = this.scene.clearColor.toLinearSpace();

        this.#defaultPipeline();
    }

    godrays( mesh ) {

        const postprocess = new BABYLON.VolumetricLightScatteringPostProcess( `${ mesh.name }_godrays`, 1.0, this.camera, mesh, 60, BABYLON.Texture.BILINEAR_SAMPLINGMODE, this.game.engine.babylon, false );
        postprocess.weight = 0.15;

        this.pipelines.push( postprocess );

        return postprocess;
    }

    atmosphere( planet ) {

        const postprocess = new AtmosphericScatteringPostProcess( `${ planet.root.name }_atmosphere`, planet, this.game.star, this.game.camera, this.scene );

        postprocess.settings.redWaveLength = planet.config.waveLengths.r;
        postprocess.settings.greenWaveLength = planet.config.waveLengths.g;
        postprocess.settings.blueWaveLength = planet.config.waveLengths.b;

        this.pipelines.push( postprocess );

        return postprocess;
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