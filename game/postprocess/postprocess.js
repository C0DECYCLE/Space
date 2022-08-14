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

    pipelines = [];

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;
        this.camera = this.manager.camera.camera;

        this.config.samples = config.samples || this.config.samples;

        this.scene.clearColor = this.scene.clearColor.toLinearSpace();

        this.#defaultPipeline();
    }

    #defaultPipeline() {

        let pipeline = new BABYLON.DefaultRenderingPipeline( "postprocess_default", true, this.scene, [ this.camera ] );
        pipeline.samples = this.config.samples;

        this.pipelines.push( pipeline );
    }

}