/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface Object {

    debugMaterialRed: BABYLON.StandardMaterial;

    debugMaterialWhite: BABYLON.StandardMaterial;
    
}

let scene: BABYLON.Scene;

window.addEventListener( "compile", ( _event: Event ): void => {

    console.log( `\n\n${ document.title }\n\nPalto Studio\nCopyright Noah Bussinger ${ new Date().getUTCFullYear() }\n\n` );

    Engine.instantiate();
    
    const background: string = "#af7ede";
    
    scene = new BABYLON.Scene( Engine.getInstance().babylon );
    BABYLON.Color4.FromHexString( background ).scaleToRef( 0.15, scene.clearColor );
    scene.ambientColor = EngineUtils.makeSceneAmbient( background, 0.3 );
    scene.debugMaterialRed = EngineUtils.makeDebugMaterial( "#ff226b" );
    scene.debugMaterialWhite = EngineUtils.makeDebugMaterial( "#ffffff" );
    scene.skipPointerMovePicking = true;
    scene.autoClear = false;
    scene.autoClearDepthAndStencil = false;

    EngineAssets.instantiate();
    EngineAssets.getInstance().onLoadObservable.addOnce( install );
    EngineAssets.getInstance().load( [

        new LoadConfig( "asteroid-a", "assets/models/asteroid-a.glb" ),
        new LoadConfig( "asteroid-b", "assets/models/asteroid-b.glb" ),
        new LoadConfig( "asteroid-c", "assets/models/asteroid-c.glb" ),

        new LoadConfig( "tree-a", "assets/models/tree-a.glb" ),

        new LoadConfig( "spaceship-vulcan", "assets/models/spaceship-vulcan.glb" )
    ] );

} );


function install(): void {


    Physics.instantiate();
    
    Controls.instantiate();

    Camera.instantiate();
    
    PostProcess.instantiate();

    UI.instantiate();

    Star.instantiate();

    Player.instantiate();

    Spaceships.instantiate();
    Spaceships.getInstance().register( "vulcan", new Config( [ "key", 0 ] ) );

    Clouds.instantiate();

    Planets.instantiate();
    Planets.getInstance().registerFromConfigs( [

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

    Asteroids.instantiate();
    Asteroids.getInstance().register( "ring", { key: 0, seed: "7417", radius: 5 * 1000, spread: 400, height: 80, density: 0.06 } );
    Asteroids.getInstance().register( "ring", { key: 1, seed: "4674", radius: 5 * 1000, spread: 1200, height: 40, density: 0.04 } );


    stage();
    Engine.getInstance().set( update, scene );
}


function stage(): void {
    

    Planets.getInstance().list[0].place( Star.getInstance().position, 500 * 1000, 90 );
    Planets.getInstance().list[1].place( Star.getInstance().position, 800 * 1000, -45 );
    Planets.getInstance().list[2].place( Star.getInstance().position, 1000 * 1000, 240 );
    Planets.getInstance().list[3].place( Planets.getInstance().list[2].position, 60 * 1000, 60 );
    
    Asteroids.getInstance().list[0].position?.copyFrom( Planets.getInstance().list[0].position );
    Asteroids.getInstance().list[1].position?.copyFrom( Planets.getInstance().list[0].position );

    Spaceships.getInstance().list[0].position.copyFrom( Planets.getInstance().list[0].position ).addInPlace( new BABYLON.Vector3( 5 * 1000, 0, 0 ) );
    Spaceships.getInstance().list[0].root.rotate( BABYLON.Axis.Y, 90 * EngineUtils.toRadian, BABYLON.Space.LOCAL );
    
    Player.getInstance().position.copyFrom( Spaceships.getInstance().list[0].position ).addInPlace( new BABYLON.Vector3( 0, 0, -10 ) );


    scene.debugLayer.show( { embedMode: true } );
}


function update(): void {
    
    
    Planets.getInstance().update();

    Asteroids.getInstance().update();

    Spaceships.getInstance().update(); 

    Player.getInstance().update();
    
    Camera.getInstance().update();

    Star.getInstance().update();

    UI.getInstance().update();


}


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


    /*
    
        Object Container did help to speed up but aren't usfull generally rather the concept of chunking together and calculate once there is usefull
        and should be applied not generally, rather there where the other method like dot with planets doesnt work! problem is amount of update calls!
    
    */


    // 6. Fix/remove whole game structure?
    // 10. use abstract classes!

    // 2. make configs in constructor optional, configs as enums? 
    // 5. look where it makes more sense to use {} again, configs etc the indexable ones?
    // 1. also use correctly undefined (unintentional not knowing of value) and null (intentional absence of value)
    
    // 7. take assets and co out of scene into standalone, like ambient etc... go to everywhere Object is interfaced and try to reduce that, also stop with the indexable interface/class thing
    // 8. go through everything look whats good whats bad what change what remove
    // 9. Make messurement of update calls to contrary of draw calls, debug both in upper corner!
    
    //!!!! before merge make javascript backup branch!!!