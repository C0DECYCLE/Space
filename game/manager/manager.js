"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Manager {

    config = {

        freeze: false
    };

    stage = null;
    scene = null;
    controls = null;
    camera = null;
    sun = null;
    planets = null;
    player = null;

    constructor( config ) {

        this.stage = new ManagerStage( this, () => this.#install(), () => this.#stage(), () => this.#run() );

        BABYLON.Logger.LogLevels = BABYLON.Logger.ErrorLogLevel;
    }

    update( delta ) {

        this.stage.run( delta );
        this.scene.render();
    }

    #install() {
        
        this.scene = new BABYLON.Scene( Space.engine.babylon );
        this.scene.enablePhysics( BABYLON.Vector3.Zero(), new BABYLON.CannonJSPlugin() );
        this.scene.collisionsEnabled = true;


        this.controls = new Controls( this, {} );

        this.camera = new Camera( this, {} );

        this.player = new Player( this, {} );

        this.planets = new Planets( this );
        this.planets.register( { key: 0, seed: new BABYLON.Vector3( -1123, 7237, -3943 ), radius: 2048, spin: 0.005/*, orbit: 0.04*/ } );
        this.planets.register( { key: 1, seed: new BABYLON.Vector3( 8513, -9011, -5910 ), radius: 2048, spin: 0.005/*, orbit: 0.02*/ } );
        this.planets.register( { key: 2, seed: new BABYLON.Vector3( -925, -2011, 7770 ), radius: 4096, spin: 0.0025/*, orbit: 0.01*/ } );
        this.planets.register( { key: 3, seed: new BABYLON.Vector3( 2253, 7001, 4099 ), radius: 512, spin: 0.01/*, orbit: 1*/ } );



                ////////////////////////////////////////////////////
                //let light2 = new BABYLON.HemisphericLight( "light2", new BABYLON.Vector3( 1, 0, 0 ), this.scene );
                //light2.intensity = 0.5;    
                //let light3 = new BABYLON.DirectionalLight( "light3", new BABYLON.Vector3( -1, -1, -1 ), this.scene );
                //light3.intensity = 0.5;  
                
                let light = new BABYLON.PointLight( "sun_light", BABYLON.Vector3.Zero(), this.scene );
                light.intensity = 0.75;  
                
                let sun = BABYLON.MeshBuilder.CreateSphere( "sun", { diameter: 12 * 1000, segments: 16 }, this.scene );
                sun.material = new BABYLON.StandardMaterial( "sun_material", this.scene );
                sun.material.diffuseColor.set( 0, 0, 0 );
                sun.material.emissiveColor = BABYLON.Color3.FromHexString("#fff4b7");
                sun.material.specularColor.set( 0, 0, 0 );
                this.sun = sun;

                //let vls = new BABYLON.VolumetricLightScatteringPostProcess( "vls", 1.0, this.camera.camera, this.sun, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, Space.engine.babylon, false );
                //vls.weight = 0.1;
                //vls.samples = 3;
                ////////////////////////////////////////////////////
                
                ////////////////////////////////////////////////////
                this.scene.clearColor.copyFrom( BABYLON.Color3.FromHexString( "#120B25" ).scale( 0.9 ) );
                this.scene.clearColor = this.scene.clearColor.toLinearSpace();
                
                let pipeline = new BABYLON.DefaultRenderingPipeline( "defaultPipeline", true, this.scene, [ this.camera.camera ] );
                pipeline.samples = 3;
                ////////////////////////////////////////////////////


        return this.scene;
    }

    #stage() {

        this.planets.list.get( 0 ).place( this.sun.position, 100 * 1000, 90 * EngineUtils.toRadian );
        this.planets.list.get( 1 ).place( this.sun.position, 200 * 1000, -45 * EngineUtils.toRadian );
        this.planets.list.get( 2 ).place( this.sun.position, 250 * 1000, 240 * EngineUtils.toRadian );
        this.planets.list.get( 3 ).place( this.planets.list.get( 2 ).root.position, 10 * 1000, 60 * EngineUtils.toRadian );
        
        this.player.root.position.copyFrom( this.planets.list.get( 3 ).root.position ).addInPlace( new BABYLON.Vector3( 1 * 1000, 0, 0 ) );
        this.player.root.rotate( BABYLON.Axis.Y, -Math.PI / 1.5, BABYLON.Space.LOCAL );
    
        this.camera.attachToPlayer( this.player );

        this.scene.debugLayer.show();


                ////////////////////////////////////////////////////
                window.dummies = EngineUtils.createDummyField( this.scene, 10, this.player.root.position, this.planets.list.get( 0 ).material );
                ////////////////////////////////////////////////////
    }

    #run( delta ) {

        if ( this.config.freeze == false ) {

            this.planets.update();
        }

        this.player.update();
        
        this.camera.update();


                ////////////////////////////////////////////////////
                window.dummies.update();
                ////////////////////////////////////////////////////
    }

}