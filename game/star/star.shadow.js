"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class StarShadow {

    config = {

        radius: 4096 * 2,
        resolution: 2048,

        bias: 0.005,
        blend: 0.3,
        lambda: 0.98,

        filter: "PCF", //"NONE" "PCF" "CONHRD"
        quality: "HIGH", //LOW MEDIUM HIGH

        //defaultPause: true
    };

    generator = null;

    #shadowMap = null;

    #star = null;
    #light = null;

    #debug = false;
    #frustumViewer = null;

    constructor( star, light, config ) {
        
        this.#star = star;
        this.#light = light;

        EngineUtils.configure.call( this, config );

        this.#configureLight();
        this.#createGenerator();
    }

    cast( mesh, value /*, recursiv = false, allowPause*/ ) {

        this.#meshRecurse( mesh, ( m ) => this.#meshCast( m, value /*, allowPause*/ ), false/*recursiv*/ );
        /*
        if ( this.config.defaultPause === true ) {

            this.pause( mesh, recursiv );
        }
        */
    }
 
    receive( mesh, value /*, recursiv = false, allowPause*/ ) {
        
        this.#meshRecurse( mesh, ( m ) => this.#meshReceive( m, value /*, allowPause*/ ), false/*recursiv*/ );
        /*
        if ( this.config.defaultPause === true ) {

            this.pause( mesh, recursiv );
        }
        */
    }

    /*
    pause( mesh, recursiv = false ) {

        this.#meshRecurse( mesh, ( m ) => this.#meshPause( m ), recursiv );
    }

    resume( mesh, recursiv = false ) {

        this.#meshRecurse( mesh, ( m ) => this.#meshResume( m ), recursiv );
    }
    */

    update() {

        if ( this.#debug === true ) {

            this.#frustumViewer?.update();
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

        if ( this.#debug === true ) {

            this.#frustumViewer = new BABYLON.DirectionalLightFrustumViewer( this.#light, this.#star.game.camera.camera );
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

        this.generator.usePercentageCloserFiltering = this.config.filter === "PCF";
        this.generator.useContactHardeningShadow = this.config.filter === "CONHRD";
        this.generator.filteringQuality = BABYLON.ShadowGenerator[ `QUALITY_${ this.config.quality }` ];

        this.generator.debug = this.#debug;
        this.generator.lambda = this.config.lambda;
        this.generator.numCascades = 4;

        this.generator.cascadeBlendPercentage = this.config.blend;
        this.generator.stabilizeCascades = this.config.stabilize;

        this.generator.shadowMaxZ = this.config.radius;
        this.generator.penumbraDarkness = 1.0;

        this.#shadowMap = this.generator.getShadowMap();
        this.#shadowMap.renderList = new SmartObjectArray( 250 );
    }

    #meshRecurse( mesh, call, recursiv = false ) {

        call( mesh );

        if ( recursiv === true ) {

            const children = mesh.getChildMeshes();

            for ( let i = 0; i < children.length; i++ ) {

                call( children[i] );
            }
        }
    }

    #meshCast( mesh, value /*, allowPause*/ ) {

        mesh.castShadow = value === undefined ? true : value;
        //mesh.allowCastShadowsPause = allowPause === undefined ? true : allowPause;
        
        if ( mesh.castShadow === true ) {

            this.#shadowMap.renderList.add( mesh );

        } else {

            this.#shadowMap.renderList.delete( mesh );
        }
    }

    #meshReceive( mesh, value /*, allowPause*/ ) {

        mesh.receiveShadow = value === undefined ? true : value;
        //mesh.allowReceiveShadowsPause = allowPause === undefined ? true : allowPause;

        mesh.receiveShadows = mesh.receiveShadow;
    }

    /*
    #meshPause( mesh ) {
        
        if ( mesh.allowCastShadowsPause === true ) {
            
            this.#shadowMap.renderList.delete( mesh );
        }

        if ( mesh.allowReceiveShadowsPause === true ) {

            mesh.receiveShadows = false;
        }
    }

    #meshResume( mesh ) {
        
        if ( mesh.allowCastShadowsPause === true && mesh.castShadow === true ) {

            this.#shadowMap.renderList.add( mesh );
        }

        if ( mesh.allowReceiveShadowsPause === true && mesh.receiveShadow === true ) {

            mesh.receiveShadows = true;
        }
    }
    */

}