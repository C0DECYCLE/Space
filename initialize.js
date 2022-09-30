"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

const Space = new Game();

Space.addOnReady( function() {
    
    
    const background = "#af7ede";
    
    this.scene = new BABYLON.Scene( this.engine.babylon );
    BABYLON.Color3.FromHexString( background ).scaleToRef( 0.25 * 0.5, this.scene.clearColor );
    this.scene.ambient = new EngineAmbient( this.scene, background, 0.25 * 1.25 );
    this.scene.debugMaterialRed = EngineUtils.makeDebugMaterial( this.scene, "#ff226b" );
    this.scene.debugMaterialWhite = EngineUtils.makeDebugMaterial( this.scene, "#ffffff" );

    this.scene.assets = new EngineAssets( this );
    this.scene.assets.onLoadObservable.addOnce( () => { this.install(); this.stage(); Space.update( this.scene, this.run ); } );
    this.scene.assets.load( [

        { key: "asteroid", path: "assets/models/asteroid.glb" },
        { key: "spaceship_vulcan", path: "assets/models/spaceship_vulcan.glb" }
    ] );
    

} );

Space.add( "install", function() {


    this.objectcontainers = new ObjectContainers( this, {} );

    this.physics = new Physics( this, {} );
    
    this.controls = new Controls( this, {} );

    this.camera = new Camera( this, {} );
    
    this.postprocess = new PostProcess( this, {} );

    this.ui = new UI( this, {} );

    this.star = new Star( this, {}, {} );

    this.player = new Player( this, {} );

    this.spaceships = new Spaceships( this, {} );

    this.spaceships.register( "vulcan", { key: 0 } );

    this.clouds = new Clouds( this, {} );

    this.planets = new Planets( this, {} );
    
    this.planets.registerFromConfigs( [

        { 
            key: 0, radius: 1024, spin: 0.005, 
            gravity: 0.6, atmosphere: 256, waveLengths: new BABYLON.Color3( 450, 370, 420 ),
            seed: new BABYLON.Vector3( -1123, 7237, -3943 ), mountainy: 5, warp: 0.8,
            colors: { main: "#92a4a8", second: "#a58685", third: "#caa88d", steep: "#66515f" }
        },

        { 
            key: 1, radius: 2048, spin: 0.005, 
            gravity: 0.7, atmosphere: 512, waveLengths: new BABYLON.Color3( 450, 500, 680 ),
            seed: new BABYLON.Vector3( 8513, -9011, -5910 ), variant: "1", mountainy: 3.5, warp: 1.0,
            colors: { main: "#d4b96d", second: "#ffb765", third: "#f4ffb5", steep: "#51515f" }
        },

        { 
            key: 2, radius: 4096, spin: 0.0025, 
            gravity: 0.8, atmosphere: 1024, waveLengths: new BABYLON.Color3( 700, 600, 500 ),
            seed: new BABYLON.Vector3( -925, -2011, 7770 ),
            colors: { main: "#7a8161", second: "#856160", third: "#a8ceb0", steep: "#252123" }
        },

        { 
            key: 3, radius: 512, spin: 0.01, 
            gravity: 0.4, atmosphere: false,
            seed: new BABYLON.Vector3( 2253, 7001, 4099 ), mountainy: 2, warp: 0.6,
            colors: { main: "#9a9aac", second: "#aa9cc0", third: "#6d7a7a", steep: "#65606e" }
        }
    ] );

    this.asteroids = new Asteroids( this, {} );

    this.asteroids.register( "ring", { key: 0, seed: "7417", radius: 5 * 1000, spread: 400, height: 200, density: 0.02 } );
    this.asteroids.register( "ring", { key: 1, seed: "4674", radius: 5 * 1000, spread: 2 * 1000, height: 100, density: 0.03 } );
    
  
} );

Space.add( "stage", function() {
    

    this.planets.list[0].place( this.star.position, 500 * 1000, 90 );
    this.planets.list[1].place( this.star.position, 800 * 1000, -45 );
    this.planets.list[2].place( this.star.position, 1000 * 1000, 240 );
    this.planets.list[3].place( this.planets.list[2].position, 60 * 1000, 60 );
    
    this.asteroids.list[0].position.copyFrom( this.planets.list[0].position );
    this.asteroids.list[1].position.copyFrom( this.planets.list[0].position );

    this.spaceships.list[0].position.copyFrom( this.planets.list[0].position ).addInPlace( new BABYLON.Vector3( 5 * 1000, 0, 0 ) );
    this.spaceships.list[0].root.rotate( BABYLON.Axis.Y, 90 * EngineUtils.toRadian, BABYLON.Space.LOCAL );
    
    this.player.position.copyFrom( this.spaceships.list[0].position ).addInPlace( new BABYLON.Vector3( 0, 0, -10 ) );
    

    this.objectcontainers.add( this.planets.list[0].root, ObjectContainers.TYPES.STATIC, true );
    this.objectcontainers.add( this.planets.list[1].root, ObjectContainers.TYPES.STATIC, true );
    this.objectcontainers.add( this.planets.list[2].root, ObjectContainers.TYPES.STATIC, true );
    this.objectcontainers.add( this.planets.list[3].root, ObjectContainers.TYPES.STATIC, true );
    
    this.objectcontainers.addAll( this.asteroids.list[0].root.getChildMeshes() );
    this.objectcontainers.addAll( this.asteroids.list[1].root.getChildMeshes() );

    this.objectcontainers.add( this.spaceships.list[0].root, ObjectContainers.TYPES.DYNAMIC );


    this.scene.debugLayer.show( { embedMode: true } );


} );

Space.add( "run", function( delta ) {
    

    this.objectcontainers.update();
    
    this.planets.update();

    this.asteroids.update();

    this.spaceships.update(); 

    this.player.update();
    
    this.camera.update();

    this.star.update();

    this.ui.update();


} );