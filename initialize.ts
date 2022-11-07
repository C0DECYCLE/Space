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

const Space: IGame = new Game();

Space.addOnReady( (): void => {
    
    
    const background: string = "#af7ede";
    
    Space.scene = new BABYLON.Scene( Space.engine.babylon );
    BABYLON.Color4.FromHexString( background ).scaleToRef( 0.15, Space.scene.clearColor );
    Space.scene.ambientColor = EngineUtils.makeSceneAmbient( background, 0.3 );
    Space.scene.debugMaterialRed = EngineUtils.makeDebugMaterial( Space.scene, "#ff226b" );
    Space.scene.debugMaterialWhite = EngineUtils.makeDebugMaterial( Space.scene, "#ffffff" );
    Space.scene.skipPointerMovePicking = true;
    Space.scene.autoClear = false;
    Space.scene.autoClearDepthAndStencil = false;

    Space.scene.assets = new EngineAssets( Space );
    Space.scene.assets.onLoadObservable.addOnce( (): void => { Space.install(); Space.stage(); Space.update( Space.scene, Space.run ); } );
    Space.scene.assets.load( [

        new LoadConfig( "asteroid-a", "assets/models/asteroid-a.glb" ),
        new LoadConfig( "asteroid-b", "assets/models/asteroid-b.glb" ),
        new LoadConfig( "asteroid-c", "assets/models/asteroid-c.glb" ),

        new LoadConfig( "tree-a", "assets/models/tree-a.glb" ),

        new LoadConfig( "spaceship-vulcan", "assets/models/spaceship-vulcan.glb" )
    ] );
    

} );

Space.add( "install", (): void => {


    Space.objectcontainers = new ObjectContainers( Space, new Config() );

    Space.physics = new Physics( Space, new Config() );
    
    Space.controls = new Controls( Space, new Config() );

    Space.camera = new Camera( Space, new Config() );
    
    Space.postprocess = new PostProcess( Space, new Config() );

    Space.ui = new UI( Space, new Config() );

    Space.star = new Star( Space, new Config(), new Config() );

    Space.player = new Player( Space, new Config() );

    Space.spaceships = new Spaceships( Space, new Config() );

    Space.spaceships.register( "vulcan", new Config( [ "key", 0 ] ) );

    Space.clouds = new Clouds( Space, new Config() );

    Space.planets = new Planets( Space, new Config() );
    
    Space.planets.registerFromConfigs( [

        //new Config( [ "key", 0 ] )...
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
            seed: new BABYLON.Vector3( 8513, -9011, -5910 ), variant: PlanetUtilsHeightmap.VARIANTS.SWIRL, mountainy: 3.5, warp: 1.0,
            colors: { main: "#f1993b", second: "#fab05c", third: "#945e41", steep: "#51515f" },
            //surface: true
        },

        { 
            key: 2, radius: 4096, spin: 0.0025, 
            gravity: 0.8, atmosphere: 1024, waveLengths: new BABYLON.Color3( 700, 600, 500 ), clouds: new Config(),
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

    Space.asteroids = new Asteroids( Space, new Config() );
                                    //new Config( [ "key", 0 ] )...
    Space.asteroids.register( "ring", { key: 0, seed: "7417", radius: 5 * 1000, spread: 400, height: 80, density: 0.06 } );
    Space.asteroids.register( "ring", { key: 1, seed: "4674", radius: 5 * 1000, spread: 1200, height: 40, density: 0.04 } );

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
    //DOTs are not faster than sqrt when first normalizing vectors, not every frame normalize entities on planet again! store normal direction of entity!
    //when chunked, distance approximation player -> target: 
    //(precalc: distance and direction from chunk center to target)
    //if chunk size small approx dist = dist to chunk center
    //more precise: approx. dist. = distance to chunk center - precalc distance from target to chunk center * dot( direction chunk center to player, precalc direction chunkcenter to target )
    //instead of reduce/avoid sqrt -> reduce / avoid loops


    // 4. remove objectcontainer system and do better approach!! backup objectcontainer before removal!!! plan removal and better approach!!!

    // 6. Fix/remove whole game structure? by using the game stuff as singletons

    // 2. make configs in constructor optional, configs as enums? 
    // 5. look where it makes more sense to use {} again, configs etc the indexable ones?
    // 1. also use correctly undefined (unintentional not knowing of value) and null (intentional absence of value)

    // 7. take assets and co out of scene into standalone, like ambient etc... go to everywhere Object is interfaced and try to reduce that, also stop with the indexable interface/class thing
    // 8. go through everything look whats good whats bad what change what remove
    
    //!!!! before merge make javascript backup branch!!!

} );

Space.add( "stage", (): void => {
    

    Space.planets.list[0].place( Space.star.position, 500 * 1000, 90 );
    Space.planets.list[1].place( Space.star.position, 800 * 1000, -45 );
    Space.planets.list[2].place( Space.star.position, 1000 * 1000, 240 );
    Space.planets.list[3].place( Space.planets.list[2].position, 60 * 1000, 60 );
    
    Space.asteroids.list[0].position?.copyFrom( Space.planets.list[0].position );
    Space.asteroids.list[1].position?.copyFrom( Space.planets.list[0].position );

    Space.spaceships.list[0].position.copyFrom( Space.planets.list[0].position ).addInPlace( new BABYLON.Vector3( 5 * 1000, 0, 0 ) );
    Space.spaceships.list[0].root.rotate( BABYLON.Axis.Y, 90 * EngineUtils.toRadian, BABYLON.Space.LOCAL );
    
    Space.player.position.copyFrom( Space.spaceships.list[0].position ).addInPlace( new BABYLON.Vector3( 0, 0, -10 ) );


    Space.objectcontainers.add( Space.planets.list[0].root, ObjectContainers.TYPES.STATIC, true ); //insert planet object?
    Space.objectcontainers.add( Space.planets.list[1].root, ObjectContainers.TYPES.STATIC, true ); //insert planet object?
    Space.objectcontainers.add( Space.planets.list[2].root, ObjectContainers.TYPES.STATIC, true ); //insert planet object?
    Space.objectcontainers.add( Space.planets.list[3].root, ObjectContainers.TYPES.STATIC, true ); //insert planet object?

    for ( let r = 0; r < Space.asteroids.list.length; r++ ) {

        for ( let c = 0; c < Space.asteroids.list[r].list.length; c++ ) {

            for ( let a = 0; a < Space.asteroids.list[r].list[c].list.length; a++ ) {
                
                Space.objectcontainers.add( Space.asteroids.list[r].list[c].list[a] );
            }
        }
    }

    Space.objectcontainers.add( Space.spaceships.list[0].root, ObjectContainers.TYPES.DYNAMIC ); //insert spaceship object?


    Space.scene.debugLayer.show( { embedMode: true } );


} );

Space.add( "run", (): void => {
    

    Space.objectcontainers.update();
    
    Space.planets.update();

    Space.asteroids.update();

    Space.spaceships.update(); 

    Space.player.update();
    
    Space.camera.update();

    Space.star.update();

    Space.ui.update();


} );