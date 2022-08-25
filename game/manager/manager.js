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
    asteroids = null;
    player = null;

    constructor( config ) {

        EngineUtils.configure( this.config, config );

        this.stage = new ManagerStage( this, ( postScene ) => this.#install( postScene ), () => this.#stage(), ( delta ) => this.#run( delta ) );

        BABYLON.Logger.LogLevels = BABYLON.Logger.ErrorLogLevel;
    }

    update( delta ) {

        this.stage.run( delta );
    }

    render() {

        this.scene.render();
    }

    #install( postScene ) {
        
        this.scene = new BABYLON.Scene( Space.engine.babylon );
        this.scene.clearColor = BABYLON.Color3.FromHexString( this.config.dark ).scale( 0.25 * 0.5 );
        this.scene.ambient = new EngineAmbient( this.scene, this.config.dark, 0.25 * 1.25 );
        
        postScene( this.scene );


        this.physics = new Physics( this, {} );
        
        this.controls = new Controls( this, {} );

        this.camera = new Camera( this, {} );
        
        this.postprocess = new PostProcess( this, {} );

        this.star = new Star( this, {}, {} );

        this.player = new Player( this, {} );

        this.planets = new Planets( this );
        
        this.planets.registerFromConfigs( [

            { 
                key: 0, radius: 1024, spin: 0.005, 
                gravity: 0.6, athmosphere: 256, waveLengths: new BABYLON.Color3( 450, 370, 420 ),
                seed: new BABYLON.Vector3( -1123, 7237, -3943 ), mountainy: 5, warp: 0.8 
            },

            { 
                key: 1, radius: 2048, spin: 0.005, 
                gravity: 0.7, athmosphere: 512, waveLengths: new BABYLON.Color3( 450, 500, 680 ),
                seed: new BABYLON.Vector3( 8513, -9011, -5910 ), variant: "1", mountainy: 3.5, warp: 1.0 
            },

            { 
                key: 2, radius: 4096, spin: 0.0025, 
                gravity: 0.8, athmosphere: 1024, waveLengths: new BABYLON.Color3( 700, 600, 500 ),
                seed: new BABYLON.Vector3( -925, -2011, 7770 )
            },

            { 
                key: 3, radius: 256, spin: 0.01, 
                gravity: 0.4, athmosphere: false,
                seed: new BABYLON.Vector3( 2253, 7001, 4099 ), mountainy: 2, warp: 0.6 
            }
        ] );

        this.asteroids = new Asteroids( this, {} );

        this.asteroids.register( "ring", { key: 0, radius: 5 * 1000, spread: 400, height: 200, density: 0.02 } );
        this.asteroids.register( "ring", { key: 1, radius: 5 * 1000, spread: 2 * 1000, height: 100, density: 0.03 } );
        
        //rework the glb/cinema4d file structure
        //copy the assets loading etc system from the old space project, but rework the file system
        //make asteroids out of models not boxes!
        
        //make method which gets the distance to the camera by traversing the parents upwards adding all positions and then subtracting it by the camera position and then the length()
        //make own lod system with screencoverage by distance and size (for the moment use naive distance of every lod enabled object but later use objectcontainers) enable lod system by default on every object? (in that case only the object self and enabled false when too small to see) when not manually set stages of lod (example: lod0, off or lod0, lod1, lod2, off )
        
        //next: make private shadow function pause/resume (internaly adds/removes shadowcaster and toggls receive shadow, with the remebemered recurse children etc parameters) which get used when somethings out of the shadow radius bubble (for the moment use naive distance of every caster/receiver but later use objectcontainers). Also add parameter to public cast/receive function, bool to allow internal pause/resume when out of shadow radius
        //next: make physics bubble (for the moment use naive distance of every physis entity but later use objectcontainers)
        
        //later: object containers, port every naive distance to the object container system (shadow bubble, physics bubble, screencoverage) by port the primary distance function self to use the objectcontainers. Every time the object container the camera is in changed switch the bool camera.containerChanged = true for one frame and then false again, nodes can ask for an aproximate distance to the camera (aproximate = error between 0 and size of an object container), the function checks if there is a cached distance of the container the object is in and if the camera.containerChanged for that frame is false then return the cached aproximate distance else recompute. If they are in the same container calculate the exact distance. (debug and compare the aproximate accuracy/speed with the naive direct distance calculation) After this try to get rid of all naive distance (length() / BABYLON.Vector3.Distance()) calculations and test before after perforance!

        return this.scene;
    }

    #stage() { 
        
        this.planets.list[0].place( this.star.position, 100 * 1000, 90 );
        this.planets.list[1].place( this.star.position, 200 * 1000, -45 );
        this.planets.list[2].place( this.star.position, 250 * 1000, 240 );
        this.planets.list[3].place( this.planets.list[2].position, 10 * 1000, 60 );
        
        this.player.position.copyFrom( this.planets.list[0].position ).addInPlace( new BABYLON.Vector3( 1 * 3000, 0, 0 ) );
        
        this.asteroids.list[0].position.copyFrom( this.planets.list[0].position );
        this.asteroids.list[1].position.copyFrom( this.planets.list[0].position );

        this.camera.attachToPlayer( this.player );

        this.scene.debugLayer.show( { embedMode: true } );
    }

    #run( delta ) {
        
        if ( this.config.freeze === false ) {

            this.planets.update();
        }

        this.asteroids.update();

        this.player.update();
        
        this.camera.update();

        this.star.update();
    }

}