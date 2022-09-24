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

    createBasicMaterial() {
        
        const material = new BABYLON.StandardMaterial( `planet${ this.#planet.config.key }_basicMaterial`, this.#planet.scene );
        material.setColorIntensity( "#534d5f", 1.0 );

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