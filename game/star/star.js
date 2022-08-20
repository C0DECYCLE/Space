"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Star {

    config = {

        color: "#fff9bc",

        size: 20 * 1000,
        resolution: 16,

        shadow: {

            radius: 1.0 * 1000,
            resolution: 2048,

            bias: 0.005,
            blend: 0.05,
            lambda: 0.85,

            filter: "PCF", //"NONE" "PCF" "CONHRD"
            quality: "HIGH" //LOW MEDIUM HIGH
        }
    };

    manager = null;
    scene = null;

    mesh = null;
    pointLight = null;
    directionalLight = null;
    hemisphericLight = null;
    shadow = null;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        this.config.color = config.color || this.config.color;
        this.config.size = config.size || this.config.size;
        this.config.resolution = config.resolution || this.config.resolution;

        if ( typeof config.shadow == "object" ) {

            this.config.shadow.radius = config.shadow.radius || this.config.shadow.radius;
            this.config.shadow.resolution = config.shadow.resolution || this.config.shadow.resolution;
            this.config.shadow.bias = config.shadow.bias || this.config.shadow.bias;
            this.config.shadow.blend = config.shadow.blend || this.config.shadow.blend;
            this.config.shadow.lambda = config.shadow.lambda || this.config.shadow.lambda;
            this.config.shadow.filter = config.shadow.filter || this.config.shadow.filter;
            this.config.shadow.quality = config.shadow.quality || this.config.shadow.quality;
        }

        this.#createMesh();
        this.#createPointLight( 0.2 );
        this.#createDirectionalLight( 0.7 );
        this.#createHemisphericLight( 0.1 );
        this.#createShadow();
        this.manager.postprocess.godrays( this.mesh );
    }

    get position() {
        
        return this.mesh.position;
    }

    get rotationQuaternion() {
        
        return this.mesh.rotationQuaternion;
    }

    update() {

        this.#target( this.manager.camera );
        this.shadow.update();
    }

    #createMesh() {

        const material = new BABYLON.StandardMaterial( "star_material", this.scene );
        material.disableLighting = true;
        material.diffuseColor.set( 0, 0, 0 );
        material.specularColor.set( 0, 0, 0 );
        material.emissiveColor = BABYLON.Color3.FromHexString( this.config.color );
        material.ambientColor.set( 0, 0, 0 );

        this.mesh = BABYLON.MeshBuilder.CreateSphere( "star", { diameter: this.config.size, segments: this.config.resolution }, this.scene );
        this.mesh.rotationQuaternion = this.mesh.rotation.toQuaternion();
        this.mesh.material = material;
    }

    #createPointLight( split ) {

        this.pointLight = new BABYLON.PointLight( "star_pointLight", BABYLON.Vector3.Zero(), this.scene );
        this.pointLight.setColor( this.config.color );
        this.pointLight.setIntensity( 0.25 * split );
    }

    #createDirectionalLight( split ) {

        this.directionalLight = new BABYLON.DirectionalLight( "star_directionalLight", BABYLON.Vector3.Zero(), this.scene );
        this.directionalLight.setColor( this.config.color );
        this.directionalLight.setIntensity( 0.25 * split );
    }

    #createHemisphericLight( split ) {

        this.hemisphericLight = new BABYLON.HemisphericLight( "star_hemisphericLight", BABYLON.Vector3.Up(), this.scene );
        this.hemisphericLight.setColor( this.config.color, this.scene.clearColor );
        this.hemisphericLight.groundColor = new BABYLON.Color3( 0, 0, 0 );
        this.hemisphericLight.setIntensity( 0.25 * split );
    }

    #createShadow() {

        this.shadow = new StarShadow( this, this.directionalLight, this.config.shadow );
    }

    #target( camera ) {

        this.directionalLight.position.copyFrom( camera.position );
        this.directionalLight.direction.copyFrom( camera.position ).normalize(); 

        this.hemisphericLight.direction.copyFrom( camera.root.up );
    }

}