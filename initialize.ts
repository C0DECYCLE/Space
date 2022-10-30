"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface Object {

    debugMaterialRed: BABYLON.StandardMaterial;

    debugMaterialWhite: BABYLON.StandardMaterial;

    assets: IEngineAssets;
    
}

const Space = new Game();

Space.addOnReady( function() {
    
    
    const background = "#af7ede";
    
    this.scene = new BABYLON.Scene( this.engine.babylon );
    BABYLON.Color3.FromHexString( background ).scaleToRef( 0.15, this.scene.clearColor );
    this.scene.ambientColor = EngineUtils.makeSceneAmbient( background, 0.3 );
    this.scene.debugMaterialRed = EngineUtils.makeDebugMaterial( this.scene, "#ff226b" );
    this.scene.debugMaterialWhite = EngineUtils.makeDebugMaterial( this.scene, "#ffffff" );
    this.scene.skipPointerMovePicking = true;
    this.scene.autoClear = false;
    this.scene.autoClearDepthAndStencil = false;

    this.scene.assets = new EngineAssets( this );
    this.scene.assets.onLoadObservable.addOnce( () => { this.install(); this.stage(); Space.update( this.scene, this.run ); } );
    this.scene.assets.load( [

        { key: "asteroid-a", path: "assets/models/asteroid-a.glb" },
        { key: "asteroid-b", path: "assets/models/asteroid-b.glb" },
        { key: "asteroid-c", path: "assets/models/asteroid-c.glb" },

        { key: "tree-a", path: "assets/models/tree-a.glb" },

        { key: "spaceship-vulcan", path: "assets/models/spaceship-vulcan.glb" }
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

    this.clouds = new Clouds( this, {} );

    this.planets = new Planets( this, {} );
    
    this.planets.registerFromConfigs( [

        { 
            key: 0, radius: 1024, spin: 0.005, 
            gravity: 0.6, atmosphere: 256, waveLengths: new BABYLON.Color3( 450, 370, 420 ),
            seed: new BABYLON.Vector3( -1123, 7237, -3943 ), mountainy: 5, warp: 0.8,
            colors: { main: "#92a4a8", second: "#a58685", third: "#caa88d", steep: "#66515f" },
            surface: true
        },

        { 
            key: 1, radius: 2048, spin: 0.005, 
            gravity: 0.7, atmosphere: 512, waveLengths: new BABYLON.Color3( 450, 500, 680 ), clouds: { color: "#a56325", cullScale: 0.003, limit: 0.375, mainScale: 0.85, heightScale: 0.5 },
            seed: new BABYLON.Vector3( 8513, -9011, -5910 ), variant: "1", mountainy: 3.5, warp: 1.0,
            colors: { main: "#f1993b", second: "#fab05c", third: "#945e41", steep: "#51515f" },
            surface: true
        },

        { 
            key: 2, radius: 4096, spin: 0.0025, 
            gravity: 0.8, atmosphere: 1024, waveLengths: new BABYLON.Color3( 700, 600, 500 ), clouds: {},
            seed: new BABYLON.Vector3( -925, -2011, 7770 ),
            colors: { main: "#7a8161", second: "#856160", third: "#a8ceb0", steep: "#252123" },
            //surface: true
        },

        { 
            key: 3, radius: 512, spin: 0.01, 
            gravity: 0.4, atmosphere: false,
            seed: new BABYLON.Vector3( 2253, 7001, 4099 ), mountainy: 2, warp: 0.6,
            colors: { main: "#a8a6d2", second: "#b3b1e0", third: "#a09dcc", steep: "#8582a8" }
        }
    ] );

    this.asteroids = new Asteroids( this, {} );

    this.asteroids.register( "ring", { key: 0, seed: "7417", radius: 5 * 1000, spread: 400, height: 80, density: 0.06 } );
    this.asteroids.register( "ring", { key: 1, seed: "4674", radius: 5 * 1000, spread: 1200, height: 40, density: 0.04 } );

    //make better optimized lod system
    // -> optimized blend in distance
    // -> optimized occlusionCullFalloff
    // -> diffrent cascading density levels
    // -> take into account size for culling (also clouds? no!)

    //better spawning patterns
    // -> cull by normal steepness
    // -> spawning just all over the planet is dummy, divide into chunks
    // -> seeded random offset on the 2d surface
    // -> spawning by specifique surface material coloring pattern
    // -> additional pattern
    // -> seeded random varing size and rotation patterns

    //make more diffrent surface obsticles for diffrent planets
    // -> Diffrent colored/shaped trees
    // -> Diffrent colored/shaped rocks (very big, medium and small)
    // -> Diffrent colored/shaped bushes & plants
    //https://www.google.com/search?q=low+poly+tree&rlz=1C5CHFA_enCH1016CH1016&sxsrf=ALiCzsaJOUdzPf_Hf8KiUElBecM-saF2GQ:1666198656789&source=lnms&tbm=isch&sa=X&ved=2ahUKEwitm8DY4ez6AhXUxQIHHX_9A4wQ_AUoAXoECAIQAw&biw=1920&bih=891&dpr=2#imgrc=4i0Qfmxjg0EccM
    //https://www.google.com/search?q=star+citizen+planets+with+trees&tbm=isch&ved=2ahUKEwifvYmihO36AhUlvicCHbm1DLcQ2-cCegQIABAA&oq=star+citizen+planets&gs_lcp=CgNpbWcQARgBMgQIIxAnMgQIABAeMgYIABAIEB4yBggAEAgQHjIGCAAQCBAeUABYAGDBCmgAcAB4AIABcogBcpIBAzAuMZgBAKoBC2d3cy13aXotaW1nwAEB&sclient=img&ei=wVBQY9_YNaX8nsEPueuyuAs&bih=891&biw=1920&rlz=1C5CHFA_enCH1016CH1016#imgrc=NVAmONWSu1x8pM
    
    //adjust asteroid min values

    //rethink the objectcontainer system, has to loop through every asteroid and call update -> inefficient chunk? clusters? not update cluster when nothing will be visible, how?, cull cluster behind planet
    //for what is the objectcontainer system good for??? remove!
    //find all times where the code dummly loops over big n of things (asteroids, clouds, surface obsticles, chunks) -> target: no loop n greater than 100-500? possible?
    //stop avoiding sqrt! thats not the problem, other things are more expencive, go back to every time avoided the distance function! and find a better solution like chunking, which was done with objectcontainer
    //when chunked, distance approximation player -> target: 
    //(precalc: distance and direction from chunk center to target)
    //if chunk size small approx dist = dist to chunk center
    //more precise: approx. dist. = distance to chunk center - precalc distance from target to chunk center * dot( direction chunk center to player, precalc direction chunkcenter to target )
    //instead of reduce/avoid sqrt -> reduce / avoid loops

//!!!! After all typescript ported go through all files again to see if no errors anymore and game still works and check that no use stricts at beginning of file!!!
//!!!! before merge make javascript backup branch!!!!
//!!!! remove objectcontainer system and do better approach!! backup objectcontainer before removal!!! plan removal and better approach!!!

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


    this.objectcontainers.add( this.planets.list[0].root, ObjectContainers.TYPES.STATIC, true ); //insert planet object?
    this.objectcontainers.add( this.planets.list[1].root, ObjectContainers.TYPES.STATIC, true ); //insert planet object?
    this.objectcontainers.add( this.planets.list[2].root, ObjectContainers.TYPES.STATIC, true ); //insert planet object?
    this.objectcontainers.add( this.planets.list[3].root, ObjectContainers.TYPES.STATIC, true ); //insert planet object?

    for ( let r = 0; r < this.asteroids.list.length; r++ ) {

        for ( let c = 0; c < this.asteroids.list[r].list.length; c++ ) {

            for ( let a = 0; a < this.asteroids.list[r].list[c].list.length; a++ ) {
                
                this.objectcontainers.add( this.asteroids.list[r].list[c].list[a] );
            }
        }
    }

    this.objectcontainers.add( this.spaceships.list[0].root, ObjectContainers.TYPES.DYNAMIC ); //insert spaceship object?


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