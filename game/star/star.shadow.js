"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class StarShadow {

    config = {

        radius: 1.0 * 1000,
        resolution: 2048,

        bias: 0.005,
        blend: 0.05,
        lambda: 0.85,

        filter: "PCF", //"NONE" "PCF" "CONHRD"
        quality: "HIGH" //LOW MEDIUM HIGH
    };

    generator = null;

    #star = null;
    #light = null;

    #debug = false;
    #frustumViewer = null;

    constructor( star, light, config ) {
        
        this.#star = star;
        this.#light = light;

        EngineUtils.configure( this.config, config );

        this.#configureLight();
        this.#createGenerator();
    }

    cast( mesh, value = true, recursiv = false ) {

        if ( value == true ) {

            this.generator.addShadowCaster( mesh, recursiv );

        } else {

            this.generator.removeShadowCaster( mesh, recursiv );
        }
    }
 
    receive( mesh, value = true, recursiv = false ) {

        mesh.receiveShadows = value;

        if ( recursiv == true ) {

            for ( let i = 0, children = mesh.getChildMeshes(); i < children.length; i++ ) {

                children[i].receiveShadows = value;
            }
        }
    }

    update() {

        if ( this.#debug == true && this.#frustumViewer != null ) {

            this.#frustumViewer.update();
        }
    }

    #configureLight() {

        this.#light.autoCalcShadowZBounds = false;
        this.#light.autoUpdateExtends = false;

        this.#light.orthoTop = -this.config.radius;
        this.#light.orthoBottom = this.config.radius;
        this.#light.orthoLeft = -this.config.radius;
        this.#light.orthoRight = this.config.radius;

        this.#light.shadowMinZ = -this.config.radius;
        this.#light.shadowMaxZ = this.config.radius;
        
        this.#light.shadowOrthoScale = 0;

        if ( this.#debug == true ) {

            this.#frustumViewer = new BABYLON.DirectionalLightFrustumViewer( this.#light, this.#star.manager.camera.camera );
        } 
    }

    #createGenerator() {

        this.generator = new BABYLON.CascadedShadowGenerator( this.config.resolution, this.#light );
        this.generator.bias = this.config.bias;
        this.generator.normalBias = 0.0;

        this.generator.setDarkness( 0.0 );
        this.generator.frustumEdgeFalloff = 0.0;

        this.generator.transparencyShadow = false;
        this.generator.enableSoftTransparentShadow = false;

        this.generator.usePercentageCloserFiltering = this.config.filter == "PCF";
        this.generator.useContactHardeningShadow = this.config.filter == "CONHRD";
        //this.generator.contactHardeningLightSizeUVRatio = 0-1;
        this.generator.filteringQuality = BABYLON.ShadowGenerator[ `QUALITY_${ this.config.quality }` ];

        this.generator.debug = this.#debug;
        this.generator.lambda = this.config.lambda;
        this.generator.numCascades = 4;

        this.generator.cascadeBlendPercentage = this.config.blend;
        this.generator.stabilizeCascades = this.config.stabilize;

        this.generator.shadowMaxZ = this.config.radius;
        this.generator.penumbraDarkness = 1.0;

        //this.generator.depthClamp = true; //not PCSS
        //this.generator.autoCalcDepthBounds = false; //what is that?
        //this.generator.autoCalcDepthBoundsRefreshRate = 2 //every second frame;
    }

}