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
        
        min: 64,
        resolution: 16,

        perlin: new perlinNoise3d()
    };

    scene = null;
    entity = null;

    generator = null;
    material = null;

    #seed = null;
    #faces = new Set();

    #cachedInsertionString = "";
    #list = new Map();

    constructor( scene, camera, config, seed = new BABYLON.Vector3( 0, 0, 0 ) ) {
    
        this.#seed = seed;

        this.scene = scene;

        this.config.key = config.key;
        this.config.radius = config.radius;
        this.config.min = config.min || this.config.min;
        this.config.resolution = config.resolution || this.config.resolution;
        this.config.perlin.noiseSeed( this.#seed.x );

        this.entity = new Entity( "planet", this.scene, camera );

        //////////////////////////////////////////////////
        /*
        let debug = BABYLON.MeshBuilder.CreateSphere( "debug", { diameter: this.config.radius * 2 * 1.5, segments: 32 }, scene );
        debug.material = new BABYLON.StandardMaterial( "debug_material", scene );
        debug.material.diffuseColor = BABYLON.Color3.FromHexString("#ff226b");
        debug.material.emissiveColor = BABYLON.Color3.FromHexString("#120B25");
        debug.material.specularColor.set( 0, 0, 0 );
        debug.material.wireframe = true;
        debug.parent = this.entity;
        */
        //////////////////////////////////////////////////

        this.generator = new PlanetGenerator( this, this.#faces );
        this.material = this.generator.createMaterial();

        let farFarAway = 1000 * 1000 * 1000;
        this.insert( new BABYLON.Vector3( 0, farFarAway, 0 ), farFarAway );
    }

    getSeed() {

        return this.#seed;
    }

    insert( originPosition, distance ) {
        
        let insertionString = this.#getInsertionString( originPosition );
        
        if ( insertionString != this.#cachedInsertionString ) {
            
            this.#insertQuadtrees( originPosition, distance );

            this.#cachedInsertionString = insertionString;
        }
    }

    disposeAll() {

        this.#list.forEach( ( data, nodeKey ) => {
        
            data.mesh.dispose( !true, false );
            this.#list.delete( nodeKey );
        } ); 
    }
    
    #getInsertionString( originPosition ) {

        let diffrence = originPosition.subtract( 

            BABYLON.Vector3.TransformCoordinates( 

                BABYLON.Vector3.One().scaleInPlace( this.config.radius ), 

                this.entity.computeOriginMatrix() 
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

    #insertQuadtrees( originPosition, distance ) {

        let params = { 
            
            insertOriginPosition: originPosition,
            
            list: this.#list,
            
            distanceCenterInsertion: distance,
            distanceRadiusFactor: distance / this.config.radius
        };

        params.centerToInsertion = originPosition.subtract( this.entity.originPosition );
        params.occlusionFallOf = ( 1 - ( ( params.centerToInsertion.length() / this.config.radius ) - 1 ) ).clamp( -0.95, 0.95 );
        params.centerToInsertion = params.centerToInsertion.normalize();

        
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