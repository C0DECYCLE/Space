"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Planet {

    config = {

        key: UUIDv4(),
        radius: 2048,
        spin: false,
        //orbit: false,

        influence: 512,
        maxHeight: 512 * 0.75,
        gravity: 0.8,
        athmosphere: 512,
        waveLengths: new BABYLON.Color3( 700, 530, 440 ),
        
        min: 64,
        resolution: 16,

        seed: null,
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
    perlin = null;
    athmosphere = null;

    #faces = [];

    #cachedInsertionString = "";
    #list = new Map(); //swop out with ? Map is good because of has(nodekey)/get(nodekey) fast but everything else SmartObjectArray with nodekey inside data would go and be faster, if would have to swop out, then would have to find fast solution for has/get by nodekey or else use the slow hasByProperty/getByProperty
    #orbitCenter = new BABYLON.Vector3( 0, 0, 0 );
    #distanceInOrbit = 0;
    #angleAroundOrbit = 0;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = manager.scene;

        EngineUtils.configure( this.config, config );

        this.#createRoot();
        this.#addGenerator();
        this.#setupPerlin();
        this.#setupPhysics();
        this.#addAthmosphere();
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

        this.position
        .copyFromFloats( Math.cos( this.#angleAroundOrbit ), 0, Math.sin( this.#angleAroundOrbit ) )
        .scaleInPlace( this.#distanceInOrbit )
        .addInPlace( this.#orbitCenter );
    }

    insert( position, distance, force = false ) {
        
        if ( force === false && distance / this.config.radius > PlanetQuadtree.INSERT_LIMIT ) {

            return;
        }

        const insertionString = this.#getInsertionString( position );
        
        if ( insertionString !== this.#cachedInsertionString ) {
            
            this.#insertQuadtrees( position, distance );

            this.#cachedInsertionString = insertionString;
        }
    }

    update() {

        this.#updateSpin();
        //this.#update();
    }

    disposeAll() {

        this.#list.forEach( ( data, nodeKey ) => {
        
            this.#disposeNode( nodeKey, data );
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

    #setupPerlin() {

        this.perlin = new perlinNoise3d();
        this.perlin.noiseSeed( this.config.seed.x );
    }

    #setupPhysics() {

        this.physics = new PlanetPhysics( this );
    }

    #addAthmosphere() {

        if ( this.config.athmosphere !== false ) {

            this.athmosphere = this.manager.postprocess.athmosphere( this );
        }
    }

    #updateSpin() {
        
        if ( this.config.spin !== false ) {

            const deltaCorrection = Space.engine.deltaCorrection;

            this.root.rotate( BABYLON.Axis.Y, this.config.spin * EngineUtils.toRadian * deltaCorrection, BABYLON.Space.LOCAL ); //make very movement speed * delta time
        }
    }
    
    #updateOrbit() {

        if ( this.config.orbit !== false ) {

            const deltaCorrection = Space.engine.deltaCorrection;

            this.#angleAroundOrbit += this.config.orbit * EngineUtils.toRadian * deltaCorrection;

            this.position
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

            centerToInsertion: position.subtract( this.position ).normalize(),
            occlusionFallOf: ( 1 - ( (distance / this.config.radius) - 1 ) ).clamp( -1.05, 0.95 )
        };
        
        this.#unkeepAll();

        for ( let i = 0; i < this.#faces.length; i++ ) {

            this.#faces[i].insert( params );
        }

        this.#disposeUnkept();
    }

    #unkeepAll() {

        this.#list.forEach( ( data, nodeKey ) => {
            
            data.keep = false;
        } );
    }

    #disposeUnkept() {

        this.#list.forEach( ( data, nodeKey ) => {
            
            if ( data.keep === false ) {
                
                this.#disposeNode( nodeKey, data );
            }
        } ); 
        
        /*data.retired = true; data.mesh.setEnabled( false );*/ 
    }

    #disposeNode( nodeKey, data ) {

        this.manager.postprocess.dispose( data.mesh );
        data.mesh.dispose( !true, false );
        this.#list.delete( nodeKey );
    }

}