"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Star {

    config = {

        color: "#fff9bc",

        size: 12 * 1000,
        resolution: 16,
    };

    manager = null;
    scene = null;

    mesh = null;
    pointLight = null;
    directionalLight = null;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        this.config.color = config.color || this.config.color;
        this.config.size = config.size || this.config.size;
        this.config.resolution = config.resolution || this.config.resolution;

        this.#createMesh();
        this.#createPointLight( 0.25 );
        this.#createDirectionalLight( 0.75 );
    }

    get position() {
        
        return this.mesh.position;
    }

    get rotationQuaternion() {
        
        return this.mesh.rotationQuaternion;
    }

    update() {

        this.#target( this.manager.camera.position.clone() );
    }

    #createMesh() {

        let material = new BABYLON.StandardMaterial( "star_material", this.scene );
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

        this.pointLight = new BABYLON.PointLight( "sun_pointlight", BABYLON.Vector3.Zero(), this.scene );
        this.pointLight.setColor( this.config.color );
        this.pointLight.setIntensity( 0.25 * split );
    }

    #createDirectionalLight( split ) {

        this.directionalLight = new BABYLON.DirectionalLight( "sun_directionallight", BABYLON.Vector3.Zero(), this.scene );
        this.directionalLight.setColor( this.config.color );
        this.directionalLight.setIntensity( 0.25 * split );
    }

    #target( position ) {

        this.directionalLight.position.copyFrom( position );
        this.directionalLight.direction = position.normalize(); 
    }

}