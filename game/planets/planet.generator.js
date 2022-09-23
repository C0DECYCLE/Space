"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetGenerator {

    #planet = null;

    constructor( planet, faces ) {
    
        this.#planet = planet;

        this.#createFaces( faces );
        this.#createMask();
        this.toggleMask( false );
        //this.#debugInfluence();
    }

    toggleMask( value ) {

        this.#planet.mask.setEnabled( value );
    }

    createMaterial() {
        
        const material = new BABYLON.StandardMaterial( `planet${ this.#planet.config.key }_material`, this.#planet.scene );
        material.setColorIntensity( "#534d5f", 1.0 );

        return material;
    }

    createCustomMaterial() {
        
        const material = new BABYLON.CustomMaterial( `planet${ this.#planet.config.key }_custumMaterial`, this.#planet.scene );
        
        const colorMain = new BABYLON.Color3.FromHexString( this.#planet.config.colorMain );
        const colorSteep = new BABYLON.Color3.FromHexString( this.#planet.config.colorSteep );
        
        material.specularColor = new BABYLON.Color3( 0, 0, 0 );
        material.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        material.ambientColor = new BABYLON.Color3( 0, 0, 0 );

        const ambient = this.#planet.scene.ambient;

        if ( typeof ambient !== "undefined" ) {

            colorMain.scale( ambient.intensity );
            colorSteep.scale( ambient.intensity );

            material.ambientColor = new BABYLON.Color3.FromHexString( ambient.color ).scale( ambient.materialFactor() );
        }
                
        material.AddUniform( "colorMain", "vec3" );
        material.AddUniform( "colorSteep", "vec3" );
        material.AddUniform( "positionCenter", "vec3" );

        material.onBindObservable.add( () => { 

            material.getEffect().setVector3( "colorMain", new BABYLON.Vector3( colorMain.r, colorMain.g, colorMain.b ) );
            material.getEffect().setVector3( "colorSteep", new BABYLON.Vector3( colorSteep.r, colorSteep.g, colorSteep.b ) );
            material.getEffect().setVector3( "positionCenter", this.#planet.position );
        } );

        //this.material.Vertex_Begin( this._getVertexBegin() );
        //this.material.Vertex_Definitions( PlanetSharedShader + this._getVertexDefinitions() );
        //this.material.Vertex_MainBegin( this._getVertexMainBegin() );
        //this.material.Vertex_Before_PositionUpdated( this._getVertexBeforePositionUpdated() );
        //this.material.Vertex_After_WorldPosComputed( this._getVertexAfterWorldPosComputed() );
        //this.material.Vertex_Before_NormalUpdated( this._getVertexBeforeNormalUpdated() );
        //this.material.Vertex_MainEnd( this._getVertexMainEnd() );

        //this.material.Fragment_Begin( this._getFragmentBegin() );
        //this.material.Fragment_Definitions( this._getFragmentDefinitions() );
        //this.material.Fragment_MainBegin( this._getFragmentMainBegin() ); 
        //this.material.Fragment_Before_Lights( this._getFragmentBeforeLights() );
        //this.material.Fragment_Before_Fog( this._getFragmentBeforeFog() );
        //this.material.Fragment_Before_FragColor( this._getFragmentBeforeFragColor() );
        material.Fragment_Custom_Diffuse( `
        
            float steep = dot( normalize( vPositionW - positionCenter ), vNormalW );

            if ( steep <= 0.9 ) {

                diffuseColor = colorSteep;

            } else if ( steep > 0.9 && steep <= 0.933 ) {

                diffuseColor = mix( colorSteep, colorMain, 0.33 );

            } else if ( steep > 0.933 && steep <= 0.966 ) {

                diffuseColor = mix( colorSteep, colorMain, 0.66 );

            } else {

                diffuseColor = colorMain;
            }
        ` );
        //this.material.Fragment_Custom_Alpha( this._getFragmentCustomAlpha() );

        return material;
    }

    createChunkMesh( nodeKey, position, fixRotation, size, resolution, distance ) {
        //maybe switch to tiledplane?
        const mesh = BABYLON.MeshBuilder.CreateGround( `planet${ this.#planet.config.key }_chunk_${ nodeKey }`, { width: size, height: size, updatable: true, subdivisions: resolution }, this.#planet.scene );

        this.updateChunkMesh( mesh, position, fixRotation );

        mesh.material = this.#planet.material;
        mesh.parent = this.#planet.root;

        this.#planet.physics.enable( mesh, size );
        
        this.#planet.game.star.shadow.cast( mesh, undefined, undefined, false );        
        this.#planet.game.star.shadow.receive( mesh, undefined, undefined, false );  

        return mesh;
    }
    
    updateChunkMesh( mesh, position, fixRotation ) {
        
        const positions = mesh.getVerticesData( BABYLON.VertexBuffer.PositionKind );

        for ( let i = 0; i < positions.length / 3; i++ ) {
            
            let vertex = new BABYLON.Vector3( positions[ i * 3 ], positions[ i * 3 + 1 ], positions[ i * 3 + 2 ] );
            
            vertex.applyRotationQuaternionInPlace( fixRotation.toQuaternion() );
            vertex.addInPlace( position );
    
            vertex = PlanetUtils.terrainify( this.#planet, vertex );

            positions[ i * 3 ] = vertex.x;
            positions[ i * 3 + 1 ] = vertex.y;
            positions[ i * 3 + 2 ] = vertex.z;
        }
        
        mesh.updateVerticesData( BABYLON.VertexBuffer.PositionKind, positions );
        mesh.convertToFlatShadedMesh();
    }

    #createFaces( faces ) {

        const suffix = "UDFBLR";
        const rotations = [

            new BABYLON.Vector3( 0, 0, 0 ), //Up
            new BABYLON.Vector3( 2, 0, 0 ), //Down
            new BABYLON.Vector3( 1, 0, 0 ), //Forward
            new BABYLON.Vector3( -1, 0, 0 ), //Backward
            new BABYLON.Vector3( 0, 0, 1 ), //Left
            new BABYLON.Vector3( 0, 0, -1 ) //Right
        ];

        for ( let i = 0; i < rotations.length; i++ ) {

            faces.push( new PlanetQuadtree( this.#planet, suffix[i], rotations[i] ) );
        }
    }
    
    #createMask() {

        this.#planet.mask = BABYLON.MeshBuilder.CreateSphere( "planet_mask", { diameter: this.#planet.config.radius * 2, segments: 16 }, this.scene );
        this.#planet.mask.material = this.#planet.game.planets.getMaskMaterial();
        this.#planet.mask.parent = this.#planet.root;

        this.#planet.game.star.shadow.cast( this.#planet.mask, undefined, undefined, false );
    }

    #debugInfluence() {

        const debug_influence = BABYLON.MeshBuilder.CreateSphere( "planet_debug_influence", { diameter: ( this.#planet.config.radius + this.#planet.config.influence ) * 2, segments: 32 }, this.#planet.scene );
        debug_influence.material = this.#planet.scene.debugMaterialRed;
        debug_influence.parent = this.#planet.root;

        const debug_maxHeight = BABYLON.MeshBuilder.CreateSphere( "planet_debug_maxHeight", { diameter: ( this.#planet.config.radius + this.#planet.config.maxHeight ) * 2, segments: 32 }, this.#planet.scene );
        debug_maxHeight.material = this.#planet.scene.debugMaterialRed;
        debug_maxHeight.parent = this.#planet.root;
    }

}