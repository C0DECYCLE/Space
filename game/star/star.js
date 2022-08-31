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

    game = null;
    scene = null;

    pointLight = null;
    directionalLight = null;
    hemisphericLight = null;

    mesh = null;
    godrays = null;
    shadow = null;
    background = null;

    constructor( game, config, config_shadow ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure( this.config, config );

        this.#createMesh();
        this.#createPointLight( 0.2 );
        this.#createDirectionalLight( 0.7 );
        this.#createHemisphericLight( 0.1 );
        this.#createShadow( config_shadow );
        this.#addGodrays();
        this.#createBackground();
    }

    get position() {
        
        return this.mesh.position;
    }

    get rotationQuaternion() {
        
        return this.mesh.rotationQuaternion;
    }

    update() {

        this.#target( this.game.camera );
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

    #createShadow( config ) {

        this.shadow = new StarShadow( this, this.directionalLight, config );
    }

    #addGodrays() {

        this.godrays = this.game.postprocess.godrays( this.mesh );
    }

    #createBackground() {

        this.background = BABYLON.MeshBuilder.CreateSphere( "star_background", { diameter: this.game.camera.config.max, segments: 4, sideOrientation: BABYLON.Mesh.BACKSIDE }, this.scene );
        
        this.background.material = new BABYLON.StandardMaterial( "star_background_material", this.scene );
        this.background.material.disableLighting = true;
        
        this.background.material.diffuseColor = new BABYLON.Color3( 0, 0, 0 );
        this.background.material.specularColor = new BABYLON.Color3( 0, 0, 0 );
        this.background.material.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        this.background.material.ambientColor = new BABYLON.Color3( 0, 0, 0 );

        this.background.material.emissiveTexture = new BABYLON.Texture( "assets/textures/space.png", this.scene );
        this.background.material.emissiveTexture.uScale = 6;
        this.background.material.emissiveTexture.vScale = 6;
    }

    #target( camera ) {

        this.directionalLight.position.copyFrom( camera.position );
        this.directionalLight.direction.copyFrom( camera.position ).normalize(); 

        this.hemisphericLight.direction.copyFrom( camera.root.up );
        
        this.background.position.copyFrom( camera.position );
    }

}