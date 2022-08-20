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
        resolution: 16
    };

    manager = null;
    scene = null;

    mesh = null;
    pointLight = null;
    directionalLight = null;
    hemisphericLight = null;
    shadow = null;
    godrays = null;

    constructor( manager, config, config_shadow ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        EngineUtils.configure( this.config, config );

        this.#createMesh();
        this.#createPointLight( 0.2 );
        this.#createDirectionalLight( 0.7 );
        this.#createHemisphericLight( 0.1 );
        this.#createShadow( config_shadow );
        this.#addGodrays();
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
        
        this.manager.postprocess.register( this.mesh );
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

    #createShadow( config ) {

        this.shadow = new StarShadow( this, this.directionalLight, config );
    }

    #addGodrays() {

        this.godrays = this.manager.postprocess.godrays( this.mesh );
    }

    #target( camera ) {

        this.directionalLight.position.copyFrom( camera.position );
        this.directionalLight.direction.copyFrom( camera.position ).normalize(); 

        this.hemisphericLight.direction.copyFrom( camera.root.up );
    }

}