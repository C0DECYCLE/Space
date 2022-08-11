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
    physicsPlugin = null;
    controls = null;
    camera = null;
    planets = null;
    player = null;

    #inspectorNode = null;

    constructor( config ) {

        this.#create();

        this.scene.onReadyObservable.add( () => this.#stage() );
    }

    update( delta ) {

        this.#updateFromInspector();

        this.player.update();
        
        this.camera.update();

        if ( this.config.freeze == false ) {

            this.planets.update();
        }


                ////////////////////////////////////////////////////
                if ( orbit == true ) {
                    this.planets.list.get( 0 ).root.rotate( BABYLON.Axis.Y, -0.0001, BABYLON.Space.LOCAL );
                    o += 0.001;
                    //this.planets.list.get( 0 ).root.position.copyFromFloats( Math.cos( o ) * 2048, 0, Math.sin( o ) * 2048 );
                }
                ////////////////////////////////////////////////////

                ////////////////////////////////////////////////////
                if ( this.dummies ) {

                    for ( let i = 0; i < this.dummies.length; i++ ) {

                        //this.dummies[i].physics.update();
            
                        this.planets.list.get( 0 ).physics.pullPhysicsEntity( this.dummies[i] );
                        this.planets.list.get( 0 ).physics.collideHeightmap( this.dummies[i] );
                        //this.planets.list.get( 0 ).physics.collideGroundBox( this.dummies[i] );
                    }
                }
                ////////////////////////////////////////////////////

                
        this.scene.render();
    }

    #create() {

        this.scene = new BABYLON.Scene( Space.engine.babylon );
        this.physicsPlugin = new BABYLON.CannonJSPlugin();
        //this.physicsPlugin.world.allowSleep = true;
        this.scene.enablePhysics( BABYLON.Vector3.Zero(), this.physicsPlugin );


        this.controls = new Controls( this, {} );

        this.camera = new Camera( this, {} );

        this.player = new Player( this, {} );

        this.planets = new Planets( this );
        this.planets.register( { key: 0, radius: 2048, seed: new BABYLON.Vector3( -1123, 7237, -3943 ) } );

        
        this.#setupInspector();


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
                window.physicsViewer = new BABYLON.Debug.PhysicsViewer();
                ////////////////////////////////////////////////////


                ////////////////////////////////////////////////////
                this.scene.clearColor.copyFrom( BABYLON.Color3.FromHexString( "#120B25" ) );
                this.scene.clearColor = this.scene.clearColor.toLinearSpace();
                
                let pipeline = new BABYLON.DefaultRenderingPipeline( "defaultPipeline", true, this.scene, [ this.camera.camera ] );
                pipeline.samples = 3;
                
                //window.atmosphere = new AtmosphericScatteringPostProcess( "atmosphere", planet, this.sun, this.camera, this.scene );
                //atmosphere.samples = 3;
                ////////////////////////////////////////////////////


                ////////////////////////////////////////////////////
                window.o = 0;
                window.orbit = false;
                ////////////////////////////////////////////////////
    }

    #stage() {

        this.planets.list.get( 0 ).root.position.copyFromFloats( 100, 100, 2048 * 2.3 );
        
        this.player.state.set( "space" );
        this.player.root.position.copyFromFloats( 0, 500, 2048 );
    
        this.camera.attachToPlayer( this.player );


                ////////////////////////////////////////////////////
                this.dummies = [];

                for ( let i = 0; i < 20; i++ ) {

                    this.dummies.push( EngineUtils.createDummy( this.scene, undefined, this.planets.list.get( 0 ).material, 
                        new BABYLON.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).scaleInPlace( 30 ).addInPlace( this.player.root.position ), 
                        new BABYLON.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).scaleInPlace( Math.PI ) 
                    ) );
                }
                ////////////////////////////////////////////////////
    }

    #setupInspector() {

        this.scene.debugLayer.show();

        this.#inspectorNode = new BABYLON.TransformNode( "{CONFIG}", this.scene );
        this.#inspectorNode._insfreeze = this.config.freeze;
        this.#inspectorNode.inspectableCustomProperties = [
            
            {
                label: "Freeze Planets",
                propertyName: "_insfreeze",
                type: BABYLON.InspectableType.Checkbox
            }
        ];
    }

    #updateFromInspector() {

        this.config.freeze = this.#inspectorNode._insfreeze;
    }
}