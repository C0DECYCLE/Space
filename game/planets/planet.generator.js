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

        material.diffuseColor = BABYLON.Color3.FromHexString("#FFEFD4");
        material.emissiveColor = BABYLON.Color3.FromHexString("#120B25");
        material.specularColor.set( 0, 0, 0 );

        return material;
    }

    createCustomMaterial() {
        
        let material = new BABYLON.CustomMaterial( `planet${ this.#planet.config.key }_custumMaterial`, this.#planet.scene );

        material.diffuseColor = BABYLON.Color3.FromHexString("#FFEFD4");
        material.emissiveColor = BABYLON.Color3.FromHexString("#120B25");
        material.specularColor.set( 0, 0, 0 );

        //material.Vertex_After_WorldPosComputed( `` );

        return material;
    }

    createChunkMesh( nodeKey, position, fixRotation, size, resolution, distance ) {

        let mesh = BABYLON.MeshBuilder.CreateGround( `planet${ this.#planet.config.key }_chunk_${ nodeKey }`, { width: size, height: size, updatable: true, subdivisions: resolution }, this.#planet.scene );
        
        mesh.material = this.#planet.material;
        //mesh.occlusionType = BABYLON.AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC; //glitchy
        //mesh.parent = this.#planet.root;
        mesh.position.copyFrom( this.#planet.root.position );
        mesh.rotationQuaternion = this.#planet.root.rotationQuaternion.clone();

        this.updateChunkMesh( mesh, position, fixRotation, size );

        this.#planet.physics.createCollisionMesh( mesh, size );

        //mesh.position.copyFrom( position );
        //mesh.rotation.copyFrom( fixRotation );
                
        return mesh;
    }
    
    updateChunkMesh( mesh, position, fixRotation, size ) {
        
        let positions = mesh.getVerticesData( BABYLON.VertexBuffer.PositionKind );

        for ( let i = 0; i < positions.length / 3; i++ ) {
            
            let vertex = new BABYLON.Vector3( positions[ i * 3 ], positions[ i * 3 + 1 ], positions[ i * 3 + 2 ] );
            
            //edge: if ( Math.abs( vertex.x / size ) == 0.5 || Math.abs( vertex.z / size ) == 0.5 )

            vertex = EngineUtils.vectorRotation( vertex, fixRotation );
            
            vertex.addInPlace( position );
    
            vertex = PlanetUtils.terrainify( vertex, this.#planet );
    
            //vertex.subtractInPlace( position );

            //vertex = EngineUtils.vectorRotation( vertex, fixRotation.negate() );

            positions[ i * 3 ] = vertex.x;
            positions[ i * 3 + 1 ] = vertex.y;
            positions[ i * 3 + 2 ] = vertex.z;
        }
        
        mesh.updateVerticesData( BABYLON.VertexBuffer.PositionKind, positions );
        mesh.convertToFlatShadedMesh();
        //mesh.forceSharedVertices();
        //mesh.removeVerticesData( BABYLON.VertexBuffer.NormalKind );
        //mesh.removeVerticesData( BABYLON.VertexBuffer.UVKind );
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