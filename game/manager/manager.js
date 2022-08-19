"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Manager {

    config = {

        dark: "#af7ede",

        freeze: false
    };

    stage = null;
    scene = null;
    physics = null;
    ambient = null;
    controls = null;
    camera = null;
    star = null;
    planets = null;
    player = null;

    constructor( config ) {

        this.config.dark = config.dark || this.config.dark;
        this.config.freeze = config.freeze || this.config.freeze;

        this.stage = new ManagerStage( this, ( postScene ) => this.#install( postScene ), () => this.#stage(), ( delta ) => this.#run( delta ) );

        BABYLON.Logger.LogLevels = BABYLON.Logger.ErrorLogLevel;
    }

    update( delta ) {

        this.stage.run( delta );
        this.scene.render();
    }

    #install( postScene ) {
        
        this.scene = new BABYLON.Scene( Space.engine.babylon );
        this.scene.clearColor = BABYLON.Color3.FromHexString( this.config.dark ).scale( 0.25 * 0.5 );
        this.scene.ambient = new Ambient( this.scene, this.config.dark, 0.25 * 1.25 );
        
        postScene( this.scene );


        this.physics = new Physics( this, {} );
        
        this.controls = new Controls( this, {} );

        this.camera = new Camera( this, {} );
        
        this.postprocess = new PostProcess( this, {} );

        this.star = new Star( this, {} );

        this.player = new Player( this, {} );

        this.planets = new Planets( this );
        
        this.planets.register( { key: 0, seed: new BABYLON.Vector3( -1123, 7237, -3943 ), radius: 1024, spin: 0.005, mountainy: 5, warp: 0.8 } );
        this.planets.register( { key: 1, seed: new BABYLON.Vector3( 8513, -9011, -5910 ), radius: 2048, spin: 0.005, variant: "1", mountainy: 3.5, warp: 1.0 } );
        this.planets.register( { key: 2, seed: new BABYLON.Vector3( -925, -2011, 7770 ), radius: 4096, /*spin: 0.0025*/ } );
        this.planets.register( { key: 3, seed: new BABYLON.Vector3( 2253, 7001, 4099 ), radius: 256, /*spin: 0.01,*/ mountainy: 2, warp: 0.6 } );
        
        
                ////////////////////////////////////////////////////
                //window.aspp = new AtmosphericScatteringPostProcess( "atmospherePostProcess", this.planets.list.get( 2 ), this.star, this.camera, this.scene );
                //aspp.samples = 3;
                //window.aspp2 = new AtmosphericScatteringPostProcess( "atmospherePostProcess2", this.planets.list.get( 3 ), this.star, this.camera, this.scene );
                ////////////////////////////////////////////////////


        return this.scene;
    }

    #stage() { 
        
        this.planets.list.get( 0 ).place( this.star.position, 100 * 1000, 90 );
        this.planets.list.get( 1 ).place( this.star.position, 200 * 1000, -45 );
        this.planets.list.get( 2 ).place( this.star.position, 250 * 1000, 240 );
        this.planets.list.get( 3 ).place( this.planets.list.get( 2 ).position, 10 * 1000, 60 );
        
        this.player.position.copyFrom( this.planets.list.get( 3 ).position ).addInPlace( new BABYLON.Vector3( 1 * 1000, 0, 0 ) );
    
        this.camera.attachToPlayer( this.player );

        this.scene.debugLayer.show( {
            embedMode: true,
        } );


                ////////////////////////////////////////////////////
                window.dummies = EngineUtils.createDummyField( this.scene, 10, this.player.position, this.planets.list.get( 0 ).material, this.star );
                ////////////////////////////////////////////////////
    }

    #run( delta ) {
        
        //planet gravity: spin with planet system
        //planet gravity: accelerate by last time on ground
        //fall trought ground bug? stopping by heightmap
        //improve planet movement, add jump and beeing able to proberly rotate the player
        //bug: planet in out state always, make dynamic in and out of planets
        
        //test out diffrent planets / their gravity config

        //implement the athmosphere fix
        //make athomsphere intensity by distance (baseIntesity / distance)
        //make very planet athmosphere, with diffrent colors etc //http://hyperphysics.phy-astr.gsu.edu/hbase/vision/specol.html
        
        if ( this.config.freeze == false ) {

            this.planets.update();
        }

        this.player.update();
        
        this.camera.update();

        this.star.update();


                ////////////////////////////////////////////////////
                window.dummies.update();
                ////////////////////////////////////////////////////
    }

}