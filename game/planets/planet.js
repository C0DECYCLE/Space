"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Planet {

    config = {

        key: undefined,
        radius: undefined,
        gravity: 0.8,
        
        min: 64,
        resolution: 16,

        seed: null,
        perlin: new perlinNoise3d()
    };

    scene = null;
    
    root = null;
    physics = null;

    generator = null;
    material = null;

    #faces = new Set();

    #cachedInsertionString = "";
    #list = new Map();

    constructor( manager, config ) {

        this.scene = manager.scene;

        this.config.key = config.key;
        this.config.radius = config.radius;
        this.config.gravity = config.gravity || this.config.gravity;
        this.config.min = config.min || this.config.min;
        this.config.resolution = config.resolution || this.config.resolution;
        this.config.seed = config.seed;
        this.config.perlin.noiseSeed( this.config.seed.x );

        this.#createRoot();
        this.#addGenerator();
        this.#setupPhysics();
        this.#farInsertion();
    }

    insert( position, distance ) {
        
        let insertionString = this.#getInsertionString( position );
        
        if ( insertionString != this.#cachedInsertionString ) {
            
            this.#insertQuadtrees( position, distance );

            this.#cachedInsertionString = insertionString;
        }
    }

    update() {

        this.#list.forEach( ( data, nodeKey ) => {
            
            data.mesh.position.copyFrom( this.root.position );
            data.mesh.rotationQuaternion.copyFrom( this.root.rotationQuaternion );
        } ); 
    }

    disposeAll() {

        this.#list.forEach( ( data, nodeKey ) => {
        
            data.mesh.dispose( !true, false );
            this.#list.delete( nodeKey );
        } ); 
    }

    #createRoot() {

        this.root = new BABYLON.Mesh( `planet${ this.config.key }`, this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();


                //////////////////////////////////////////////////
                /*
                let debug = BABYLON.MeshBuilder.CreateSphere( "debug", 
                { diameter: this.config.radius * 2 * 1.5, segments: 32 }, scene );
                debug.material = new BABYLON.StandardMaterial( "debug_material", scene );
                debug.material.diffuseColor = BABYLON.Color3.FromHexString("#ff226b");
                debug.material.emissiveColor = BABYLON.Color3.FromHexString("#120B25");
                debug.material.specularColor.set( 0, 0, 0 );
                debug.material.wireframe = true;
                debug.parent = this.root;
                */
                //////////////////////////////////////////////////
    }

    #addGenerator() {

        this.generator = new PlanetGenerator( this, this.#faces );
        this.material = this.generator.createMaterial();
        this.custumMaterial = this.generator.createCustomMaterial();
    }

    #setupPhysics() {

        this.physics = new PlanetPhysics( this );
    }

    #farInsertion() {

        let farFarAway = EngineUtils.getFarAway();
        this.insert( farFarAway, farFarAway.y );
    }
    
    #getInsertionString( position ) {

        let diffrence = position.subtract( 

            BABYLON.Vector3.TransformCoordinates( 

                BABYLON.Vector3.One().scaleInPlace( this.config.radius ), 

                this.root.computeWorldMatrix( true ) 
            )
        );

        let rdez = 10;

        diffrence.copyFromFloats(

            Math.round( diffrence.x / rdez ) * rdez, 
            Math.round( diffrence.y / rdez ) * rdez, 
            Math.round( diffrence.z / rdez ) * rdez
        );

        return diffrence.toString();
    }

    #insertQuadtrees( position, distance ) {

        let params = { 
            
            insertposition: position,
            
            list: this.#list,
            
            distanceCenterInsertion: distance,
            distanceRadiusFactor: distance / this.config.radius,

            centerToInsertion: position.subtract( this.root.position ).normalize(),
            occlusionFallOf: ( 1 - ( (distance / this.config.radius) - 1 ) ).clamp( -0.95, 0.95 )
        };
        
        this.#unkeepAll();

        this.#faces.forEach( quadtree => quadtree.insert( params ) );

        this.#disposeUnkept();
    }

    #unkeepAll() {

        this.#list.forEach( ( data, nodeKey ) => {
            
            data.keep = false;
        } );
    }

    #disposeUnkept() {

        this.#list.forEach( ( data, nodeKey ) => {
            
            if ( data.keep == false ) {
                
                data.mesh.dispose( !true, false );
                this.#list.delete( nodeKey );
            }
        } ); 
        
        /*data.retired = true; data.mesh.setEnabled( false );*/ 
    }

}