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


        this.controls = new Controls( this, {} );

        this.camera = new Camera( this, {} );

        this.player = new Player( this, {} );

        this.planets = new Planets( this );
        this.planets.register( { key: 0, radius: 2048, seed: new BABYLON.Vector3( -1123, 7237, -3943 ) } );
        this.planets.register( { key: 1, radius: 2048, seed: new BABYLON.Vector3( 8513, -9011, -5910 ) } );
        this.planets.register( { key: 2, radius: 2048, seed: new BABYLON.Vector3( -925, -2011, 7770 ) } );



                ////////////////////////////////////////////////////
                let light2 = new BABYLON.HemisphericLight( "light2", new BABYLON.Vector3( 0, 1, 0 ), this.scene );
                light2.intensity = 0.5;    
                let light3 = new BABYLON.DirectionalLight( "light3", new BABYLON.Vector3( -1, -1, -1 ), this.scene );
                light3.intensity = 0.5;  
                /*
                let light = new BABYLON.PointLight( "sun_light", BABYLON.Vector3.Zero(), this.scene );
                light.intensity = 0.5;  
                */
                let sun = BABYLON.MeshBuilder.CreateSphere( "sun", { diameter: 12 * 1000, segments: 16 }, this.scene );
                sun.material = new BABYLON.StandardMaterial( "sun_material", this.scene );
                sun.material.diffuseColor.set( 0, 0, 0 );
                sun.material.emissiveColor = BABYLON.Color3.FromHexString("#fff4b7");
                sun.material.specularColor.set( 0, 0, 0 );
                ////////////////////////////////////////////////////
                


                ////////////////////////////////////////////////////
                this.scene.clearColor.copyFrom( BABYLON.Color3.FromHexString( "#120B25" ) );
                this.scene.clearColor = this.scene.clearColor.toLinearSpace();
                
                let pipeline = new BABYLON.DefaultRenderingPipeline( "defaultPipeline", true, this.scene, [ this.camera.camera ] );
                pipeline.samples = 3;
                ////////////////////////////////////////////////////


        return this.scene;
    }

    #stage() {

        this.planets.list.get( 0 ).root.position.copyFromFloats( Math.cos( Math.PI / 2 ), 0, Math.sin( Math.PI / 2 ) ).scaleInPlace( 100 * 1000 );
        this.planets.list.get( 1 ).root.position.copyFromFloats( Math.cos( -Math.PI / 4 ), 0, Math.sin( -Math.PI / 4 ) ).scaleInPlace( 200 * 1000 );
        this.planets.list.get( 2 ).root.position.copyFromFloats( -Math.cos( Math.PI / 3 ), 0, -Math.sin( Math.PI / 3 ) ).scaleInPlace( 250 * 1000 );
        
        this.player.root.position.copyFrom( this.planets.list.get( 0 ).root.position ).addInPlace( new BABYLON.Vector3( 500, 0, -3 * 1000 ) );
    
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
                if ( window.orbit == true ) {
                    this.planets.list.get( 0 ).root.rotate( BABYLON.Axis.Y, -0.0001, BABYLON.Space.LOCAL );
                    this.planets.list.get( 1 ).root.rotate( BABYLON.Axis.Y, -0.0002, BABYLON.Space.LOCAL );
                    this.planets.list.get( 2 ).root.rotate( BABYLON.Axis.Y, -0.00005, BABYLON.Space.LOCAL );
                    //window.o += 0.001;
                    //this.planets.list.get( 0 ).root.position.copyFromFloats( Math.cos( window.o ) * 2048, 0, Math.sin( window.o ) * 2048 );
                }
                ////////////////////////////////////////////////////

                ////////////////////////////////////////////////////
                window.dummies.update();
                ////////////////////////////////////////////////////
    }

}