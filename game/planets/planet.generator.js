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
    }

    createMaterial() {
        
        let material = new BABYLON.StandardMaterial( `planet${ this.#planet.config.key }_material`, this.#planet.scene );
        material.setColorIntensity( "#534d5f", 1.0 );

        return material;
    }

    createCustomMaterial() {
        
        let material = new BABYLON.CustomMaterial( `planet${ this.#planet.config.key }_custumMaterial`, this.#planet.scene );
        material.setColorIntensity( "#534d5f", 1.0 );

        return material;
    }

    createChunkMesh( nodeKey, position, fixRotation, size, resolution, distance ) {
        //maybe switch to tiledplane?
        let mesh = BABYLON.MeshBuilder.CreateGround( `planet${ this.#planet.config.key }_chunk_${ nodeKey }`, { width: size, height: size, updatable: true, subdivisions: resolution }, this.#planet.scene );

        this.updateChunkMesh( mesh, position, fixRotation );

        mesh.material = this.#planet.material;
        mesh.parent = this.#planet.root;

        this.#planet.physics.createCollisionMesh( mesh, size );
        this.#planet.manager.star.shadow.cast( mesh, true, false );        
        this.#planet.manager.star.shadow.receive( mesh, true, false );        

        return mesh;
    }
    
    updateChunkMesh( mesh, position, fixRotation ) {
        
        let positions = mesh.getVerticesData( BABYLON.VertexBuffer.PositionKind );

        for ( let i = 0; i < positions.length / 3; i++ ) {
            
            let vertex = new BABYLON.Vector3( positions[ i * 3 ], positions[ i * 3 + 1 ], positions[ i * 3 + 2 ] );
            
            vertex = EngineUtils.vectorRotation( vertex, fixRotation );
            
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

        let suffix = "UDFBLR";
        let rotations = [

            new BABYLON.Vector3( 0, 0, 0 ), //Up
            new BABYLON.Vector3( 2, 0, 0 ), //Down
            new BABYLON.Vector3( 1, 0, 0 ), //Forward
            new BABYLON.Vector3( -1, 0, 0 ), //Backward
            new BABYLON.Vector3( 0, 0, 1 ), //Left
            new BABYLON.Vector3( 0, 0, -1 ) //Right
        ];

        for ( let i = 0; i < rotations.length; i++ ) {

            faces.add( new PlanetQuadtree( this.#planet, suffix[i], rotations[i] ) );
        }
    }
    
}