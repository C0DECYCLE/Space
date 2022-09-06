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
        atmosphere: 512,
        waveLengths: new BABYLON.Color3( 700, 530, 440 ),
        
        min: 64,
        resolution: 16,

        seed: null,
        variant: "0", //"1"
        mountainy: 7.5, //3.5
        warp: 0.3 //1.0
    };

    game = null;
    scene = null;
    
    root = null;
    lod = null;
    physics = null;

    generator = null;
    material = null;
    perlin = null;
    atmosphere = null;

    #faces = [];

    #cachedInsertionString = "";
    #oversteppedInsertLimit = false;
    #list = new Map();
    #orbitCenter = new BABYLON.Vector3( 0, 0, 0 );
    #distanceInOrbit = 0;
    #angleAroundOrbit = 0;

    constructor( game, config ) {

        this.game = game;
        this.scene = game.scene;

        EngineUtils.configure.call( this, config );

        this.#createRoot();
        this.#createLod();
        this.#addGenerator();
        this.#setupPerlin();
        this.#setupPhysics();
        this.#addAtmosphere();
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

        this.#updateAtmosphereDensity( distance );

        if ( force === true ) {

            this.#evalInsertionWithString( position, distance );
            return;
        }

        if ( distance / this.config.radius > PlanetQuadtree.INSERT_LIMIT ) {

            if ( this.#oversteppedInsertLimit === false ) {
                
                this.#oversteppedInsertLimit = true;
                //two times: first time removes half limit resolution chunk,
                //second makes the lowest resolution chunk for outside of the limit
                this.#insertQuadtrees( position, distance );
                this.#insertQuadtrees( position, distance );
            }
            
        } else {

            this.#oversteppedInsertLimit = false;
            this.#evalInsertionWithString( position, distance );
        }
    }

    update() {

        this.#updateLod();
        this.#updateSpin();
        //this.#updateOrbit();
    }

    #createRoot() {

        this.root = new BABYLON.TransformNode( `planets_planet${ this.config.key }`, this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    #createLod() {

        this.lod = new LOD( this.game );
        this.lod.fromSingle( this.root );
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

    #addAtmosphere() {

        if ( this.config.atmosphere !== false ) {

            this.atmosphere = this.game.postprocess.atmosphere( this );
        }
    }

    #updateLod() {

        this.lod.update();
    }

    #updateAtmosphereDensity( distance ) {

        if ( this.config.atmosphere !== false ) {

            if ( this.lod.isVisible === false ) {

                if ( this.atmosphere.settings.densityModifier !== 0 ) {
    
                    this.atmosphere.settings.densityModifier = 0;
                }
            
            } else {

                const distanceCenterInfluence = this.config.radius + this.config.maxHeight;
                const distanceToInfluence = distance - distanceCenterInfluence;
                const distanceInfluenceLimit = ( PlanetQuadtree.INSERT_LIMIT * this.config.radius ) - distanceCenterInfluence;

                this.atmosphere.settings.densityModifier = ( 1 - ( ( distanceToInfluence / distanceInfluenceLimit ).clamp( 0, 1 ) * 0.8 ) );
            }
        }
    }

    #updateSpin() {
        
        if ( this.config.spin !== false ) {

            const deltaCorrection = this.game.engine.deltaCorrection;

            this.root.rotate( BABYLON.Axis.Y, this.config.spin * EngineUtils.toRadian * deltaCorrection, BABYLON.Space.LOCAL ); //make very movement speed * delta time
        }
    }
    
    #updateOrbit() {

        if ( this.config.orbit !== false ) {

            const deltaCorrection = this.game.engine.deltaCorrection;

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
        
        EngineUtils.getBounding( this.root, true );
    }
    
    #evalInsertionWithString( position, distance ) {

        const insertionString = this.#getInsertionString( position );
        
        if ( insertionString !== this.#cachedInsertionString ) {
            
            this.#insertQuadtrees( position, distance );
            
            this.#cachedInsertionString = insertionString;
        }
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

        data.mesh.dispose( !true, false );
        this.#list.delete( nodeKey );
    }

}