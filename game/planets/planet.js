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
        influence: 0.5,

        spin: false,
        orbit: false,
        
        min: 64,
        resolution: 16,

        seed: null,
        perlin: new perlinNoise3d(),
        variant: "0", //"1"
        mountainy: 7.5, //3.5
        warp: 0.3 //1.0
    };

    manager = null;
    scene = null;
    
    root = null;
    physics = null;

    generator = null;
    material = null;

    #faces = new Set();

    #cachedInsertionString = "";
    #list = new Map();
    #orbitCenter = new BABYLON.Vector3( 0, 0, 0 );
    #distanceInOrbit = 0;
    #angleAroundOrbit = 0;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = manager.scene;

        this.config.key = config.key;
        this.config.radius = config.radius;
        this.config.gravity = config.gravity || this.config.gravity;
        this.config.influence = config.influence || this.config.influence;
        this.config.spin = config.spin || this.config.spin;
        this.config.orbit = config.orbit || this.config.orbit;
        this.config.min = config.min || this.config.min;
        this.config.resolution = config.resolution || this.config.resolution;
        this.config.seed = config.seed;
        this.config.perlin.noiseSeed( this.config.seed.x );
        this.config.variant = config.variant || this.config.variant;
        this.config.mountainy = config.mountainy || this.config.mountainy;
        this.config.warp = config.warp || this.config.warp;

        this.#createRoot();
        this.#addGenerator();
        this.#setupPhysics();
        this.#farInsertion();
    }

    get position() {
        
        return this.root.position;
    }

    get rotationQuaternion() {
        
        return this.root.rotationQuaternion;
    }

    place( orbitCenter, distanceInOrbit, angleAroundOrbit ) {

        this.#orbitCenter = orbitCenter;
        this.#distanceInOrbit = distanceInOrbit;
        this.#angleAroundOrbit = angleAroundOrbit * EngineUtils.toRadian;

        this.root.position
        .copyFromFloats( Math.cos( this.#angleAroundOrbit ), 0, Math.sin( this.#angleAroundOrbit ) )
        .scaleInPlace( this.#distanceInOrbit )
        .addInPlace( this.#orbitCenter );
    }

    insert( position, distance, force = false ) {
        
        if ( force == false && distance / this.config.radius > PlanetQuadtree.INSERT_LIMIT ) {

            return;
        }

        const insertionString = this.#getInsertionString( position );
        
        if ( insertionString != this.#cachedInsertionString ) {
            
            this.#insertQuadtrees( position, distance );

            this.#cachedInsertionString = insertionString;
        }
    }

    update( deltaCorrection ) {

        this.#updateSpin( deltaCorrection );
        this.#updateOrbit( deltaCorrection );
    }

    disposeAll() {

        this.#list.forEach( ( data, nodeKey ) => {
        
            data.mesh.dispose( !true, false );
            this.#list.delete( nodeKey );
        } ); 
    }

    #createRoot() {

        this.root = new BABYLON.TransformNode( `planet${ this.config.key }`, this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    #addGenerator() {

        this.generator = new PlanetGenerator( this, this.#faces );
        this.material = this.generator.createMaterial();
        //this.custumMaterial = this.generator.createCustomMaterial();
    }

    #setupPhysics() {

        this.physics = new PlanetPhysics( this );
    }

    #updateSpin( dC ) {
        
        if ( this.config.spin != false ) {

            this.root.rotate( BABYLON.Axis.Y, this.config.spin * EngineUtils.toRadian * dC, BABYLON.Space.LOCAL ); //make very movement speed * delta time
        }
    }
    
    #updateOrbit( dC ) {

        if ( this.config.orbit != false ) {

            this.#angleAroundOrbit += this.config.orbit * EngineUtils.toRadian * dC;

            this.root.position
            .copyFromFloats( Math.cos( this.#angleAroundOrbit ), 0, Math.sin( this.#angleAroundOrbit ) )
            .scaleInPlace( this.#distanceInOrbit )
            .addInPlace( this.#orbitCenter );
        }
    }

    #farInsertion() {

        const farFarAway = EngineUtils.getFarAway();
        this.insert( farFarAway, farFarAway.y, true );
    }
    
    #getInsertionString( position ) {

        const diffrence = position.subtract( 

            BABYLON.Vector3.TransformCoordinates( 

                BABYLON.Vector3.One().scaleInPlace( this.config.radius ), 

                this.root.computeWorldMatrix( true ) 
            )
        );

        const rdez = 10;

        diffrence.copyFromFloats(

            Math.round( diffrence.x / rdez ) * rdez, 
            Math.round( diffrence.y / rdez ) * rdez, 
            Math.round( diffrence.z / rdez ) * rdez
        );

        return diffrence.toString();
    }

    #insertQuadtrees( position, distance ) {

        const params = { 
            
            insertposition: position,
            
            list: this.#list,
            
            distanceCenterInsertion: distance,
            distanceRadiusFactor: distance / this.config.radius,

            centerToInsertion: position.subtract( this.root.position ).normalize(),
            occlusionFallOf: ( 1 - ( (distance / this.config.radius) - 1 ) ).clamp( -1.05, 0.95 )
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