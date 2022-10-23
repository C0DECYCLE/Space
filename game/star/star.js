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

    //pointLight = null;
    directionalLight = null;
    hemisphericLight = null;

    mesh = null;
    godrays = null;
    shadow = null;
    background = null;

    constructor( game, config, config_shadow ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure.call( this, config );

        this.#createMesh();
        //this.#createPointLight( 0.3 );
        this.#createDirectionalLight( 0.4 );
        this.#createHemisphericLight( 0.02 );
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

    get lightDirection() {

        return this.directionalLight.direction;
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
        material.freeze();log("freeze",material.name);

        this.mesh = BABYLON.MeshBuilder.CreateSphere( "star", { diameter: this.config.size, segments: this.config.resolution }, this.scene );
        this.mesh.removeVerticesData( BABYLON.VertexBuffer.NormalKind );
        this.mesh.removeVerticesData( BABYLON.VertexBuffer.UVKind );
        this.mesh.rotationQuaternion = this.mesh.rotation.toQuaternion();
        this.mesh.isPickable = false;
        this.mesh.material = material;

        PhysicsEntity.collidable( this.mesh );
    }

    #createPointLight( intensity ) {

        this.pointLight = new BABYLON.PointLight( "star_pointLight", BABYLON.Vector3.Zero(), this.scene );
        EngineExtensions.setLightColor( this.pointLight, this.config.color );
        EngineExtensions.setLightIntensity( this.pointLight, intensity );
    }

    #createDirectionalLight( intensity ) {

        this.directionalLight = new BABYLON.DirectionalLight( "star_directionalLight", BABYLON.Vector3.Zero(), this.scene );
        EngineExtensions.setLightColor( this.directionalLight, this.config.color );
        EngineExtensions.setLightIntensity( this.directionalLight, intensity );
    }

    #createHemisphericLight( intensity ) {

        this.hemisphericLight = new BABYLON.HemisphericLight( "star_hemisphericLight", BABYLON.Vector3.Up(), this.scene );
        EngineExtensions.setLightColor( this.hemisphericLight, this.config.color );
        EngineExtensions.setLightIntensity( this.hemisphericLight, intensity );
    }

    #createShadow( config ) {

        this.shadow = new StarShadow( this, this.directionalLight, config );
    }

    #addGodrays() {

        this.godrays = this.game.postprocess.godrays( this.mesh );
    }

    #createBackground() {

        this.background = BABYLON.MeshBuilder.CreateSphere( "star_background", { diameter: this.game.camera.config.max, segments: 4, sideOrientation: BABYLON.Mesh.BACKSIDE }, this.scene );
        this.background.removeVerticesData( BABYLON.VertexBuffer.NormalKind );
        
        this.background.isPickable = false;

        this.background.material = new BABYLON.StandardMaterial( "star_background_material", this.scene );
        this.background.material.disableLighting = true;
        
        this.background.material.diffuseColor = new BABYLON.Color3( 0, 0, 0 );
        this.background.material.specularColor = new BABYLON.Color3( 0, 0, 0 );
        this.background.material.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        this.background.material.ambientColor = new BABYLON.Color3( 0, 0, 0 );

        this.background.material.emissiveTexture = new BABYLON.Texture( "assets/textures/space.png", this.scene );
        this.background.material.emissiveTexture.uScale = 6;
        this.background.material.emissiveTexture.vScale = 6;

        this.background.material.freeze();
    }

    #target( camera ) {

        this.directionalLight.position.copyFrom( camera.position );
        this.directionalLight.direction.copyFrom( camera.position ).normalize(); 

        this.hemisphericLight.direction.copyFrom( camera.root.up );
        
        this.background.position.copyFrom( camera.position );
    }

}