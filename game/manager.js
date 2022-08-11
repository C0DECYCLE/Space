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

    scene = null;
    controls = null;
    camera = null;
    planets = null;
    player = null;

    constructor( config ) {

        this.#create();

        this.#stage();
    }

    #create() {

        this.scene = new BABYLON.Scene( Space.engine.babylon );

        this.controls = new Controls( this.scene, {} );

        this.camera = new Camera( this.scene, this.controls, {} );

        this.player = new Player( this.scene, {}, this.camera, this.controls );

        this.planets = new Planets( this.camera, this.player );

        let planet = new Planet( this.scene, this.camera, { key: 0, radius: 1024 }, new BABYLON.Vector3( -1123, 7237, -3943 ) );
        
        this.planets.register( planet );


                ////////////////////////////////////////////////////
                let light2 = new BABYLON.HemisphericLight( "light2", new BABYLON.Vector3( 0, 1, 0 ), this.scene );
                light2.intensity = 0.5;    
                let light3 = new BABYLON.DirectionalLight( "light3", new BABYLON.Vector3( -1, -1, -1 ), this.scene );
                light3.intensity = 0.5;  
                /*
                this.sun = new Entity( "sun", this.scene, this.camera );
                let light = new BABYLON.PointLight( "sun_light", BABYLON.Vector3.Zero(), this.scene );
                light.intensity = 0.5;  
                light.parent = this.sun;
                */
                ////////////////////////////////////////////////////
                

                ////////////////////////////////////////////////////
                this.scene.debugLayer.show();
                this.scene.clearColor = this.scene.clearColor.toLinearSpace();
                
                let pipeline = new BABYLON.DefaultRenderingPipeline( "defaultPipeline", true, this.scene, [ this.camera.camera ] );
                pipeline.samples = 3;
                
                //window.atmosphere = new AtmosphericScatteringPostProcess( "atmosphere", planet, this.sun, this.camera, this.scene );
                //atmosphere.samples = 3;
                ////////////////////////////////////////////////////
    }

    #stage() {

        this.planets.list.get( 0 ).entity.originPosition.copyFromFloats( 100, 100, 2048 * 2 );
        
        this.player.state.set( "space" );
        this.player.entity.originPosition.copyFromFloats( 0, 500, 2048 );
    
        this.camera.attachToPlayer( this.player );

        
                ////////////////////////////////////////////////////
                //window.o = 0;
                ////////////////////////////////////////////////////
    }

    update( delta ) {

        this.player.update();
        
        this.camera.update();

        if ( this.config.freeze == false ) {

            this.planets.update();
        }


                ////////////////////////////////////////////////////
                //this.planets.list.get( 0 ).entity.rotate( BABYLON.Axis.Y, -0.001, BABYLON.Space.LOCAL );
                //o += 0.001;
                //this.planets.list.get( 0 ).entity.originPosition.copyFromFloats( Math.cos( o ) * 2048, 0, Math.sin( o ) * 2048 );
                //this.planets.list.get( 0 ).entity.originManualUpdate = true;
                ////////////////////////////////////////////////////


        this.scene.render();
    }

}