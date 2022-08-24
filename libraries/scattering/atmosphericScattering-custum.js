"use strict";

class AtmosphericScatteringPostProcess extends BABYLON.PostProcess {

    settings = {

        falloffFactor: 15,
        intensity: 15,
        scatteringStrength: 1,
        densityModifier: 1,

        redWaveLength: 700,
        greenWaveLength: 530,
        blueWaveLength: 440
    };

    camera = null;
    star = null;
    planet = null;

    constructor( name, planet, star, camera, depthMap, scene ) {
        
        super( name, "../core/scattering/atmosphericScattering", [

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

        this.camera = camera;
        this.star = star;
        this.planet = planet;

        this.settings.planetRadius = planet.config.radius - planet.config.athmosphere * 1,
        this.settings.atmosphereRadius = planet.config.radius + planet.config.athmosphere * 2,

        this.setCamera( this.camera );

        this.onApply = ( effect ) => {

            effect.setTexture( "depthSampler", depthMap );
            
            effect.setVector3( "sunPosition", this.star.position );
            effect.setVector3( "cameraPosition", this.camera.camera.globalPosition );
            effect.setVector3( "planetPosition", this.planet.position );

            effect.setMatrix( "projection", this.camera.camera.getProjectionMatrix() );
            effect.setMatrix( "view", this.camera.camera.getViewMatrix() );
            effect.setFloat( "cameraNear", camera.camera.minZ );
            effect.setFloat( "cameraFar", camera.camera.maxZ );

            effect.setFloat( "planetRadius", this.settings.planetRadius );
            effect.setFloat( "atmosphereRadius", this.settings.atmosphereRadius );

            effect.setFloat( "falloffFactor", this.settings.falloffFactor );
            effect.setFloat( "sunIntensity", this.settings.intensity );
            effect.setFloat( "scatteringStrength", this.settings.scatteringStrength );
            effect.setFloat( "densityModifier", this.settings.densityModifier );

            effect.setFloat( "redWaveLength", this.settings.redWaveLength );
            effect.setFloat( "greenWaveLength", this.settings.greenWaveLength );
            effect.setFloat( "blueWaveLength", this.settings.blueWaveLength );
        };
    }

    setCamera( camera ) {

        this.camera.camera.detachPostProcess(this);
        this.camera = camera;

        camera.camera.attachPostProcess(this);
    }
}