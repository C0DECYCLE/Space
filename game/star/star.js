"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Star {

    config = {

        size: 12 * 1000,
        resolution: 16
    };

    manager = null;
    scene = null;

    mesh = null;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        this.config.size = config.size || this.config.size;
        this.config.resolution = config.resolution || this.config.resolution;

        this.#createMesh();

        
                ////////////////////////////////////////////////////
                //let light2 = new BABYLON.HemisphericLight( "light2", new BABYLON.Vector3( 1, 0, 0 ), this.scene );
                //light2.intensity = 0.5;    
                //let light3 = new BABYLON.DirectionalLight( "light3", new BABYLON.Vector3( -1, -1, -1 ), this.scene );
                //light3.intensity = 0.5;  
                
                let light = new BABYLON.PointLight( "sun_light", BABYLON.Vector3.Zero(), this.scene );
                light.intensity = 0.75;  
                ////////////////////////////////////////////////////
    }

    get position() {
        
        return this.mesh.position;
    }

    get rotationQuaternion() {
        
        return this.mesh.rotationQuaternion;
    }

    #createMesh() {

        let material = new BABYLON.StandardMaterial( "star_material", this.scene );
        material.diffuseColor.set( 0, 0, 0 );
        material.emissiveColor = BABYLON.Color3.FromHexString("#fff4b7");
        material.specularColor.set( 0, 0, 0 );

        this.mesh = BABYLON.MeshBuilder.CreateSphere( "star", { diameter: this.config.size, segments: this.config.resolution }, this.scene );
        this.mesh.rotationQuaternion = this.mesh.rotation.toQuaternion();
        this.mesh.material = material;
    }

}