"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetChunk extends BABYLON.Mesh {

    #planet = null;
    
    constructor( planet, params ) {
    
        super( `planet${ planet.config.key }_material`, planet.scene );

        this.#planet = planet;

        /*
        
        const ground = new GroundMesh(name, scene);
        const vertexData = this.(options);
        vertexData.applyToMesh(ground, options.updatable);
        
        */

        //( nodeKey, position, fixRotation, size, resolution, distance )
        
        const mesh = BABYLON.MeshBuilder.CreateGround( `planet${ this.#planet.config.key }_chunk_${ nodeKey }`, { width: size, height: size, updatable: true, subdivisions: resolution }, this.#planet.scene );

        this.updateChunkMesh( mesh, position, fixRotation );

        mesh.material = this.#planet.material;
        mesh.parent = this.#planet.root;

        this.#planet.physics.enable( mesh, size );
        
        this.#planet.game.star.shadow.cast( mesh, undefined, undefined, false );        
        this.#planet.game.star.shadow.receive( mesh, undefined, undefined, false );  

        return mesh;

    }

    CreateGroundVertexData(options: { width?: number; height?: number; subdivisions?: number; subdivisionsX?: number; subdivisionsY?: number }): VertexData {
        const indices = [];
        const positions = [];
        const normals = [];
        const uvs = [];
        let row: number, col: number;
    
        const width: number = options.width || 1;
        const height: number = options.height || 1;
        const subdivisionsX: number = options.subdivisionsX || options.subdivisions || 1;
        const subdivisionsY: number = options.subdivisionsY || options.subdivisions || 1;
    
        for (row = 0; row <= subdivisionsY; row++) {
            for (col = 0; col <= subdivisionsX; col++) {
                const position = new Vector3((col * width) / subdivisionsX - width / 2.0, 0, ((subdivisionsY - row) * height) / subdivisionsY - height / 2.0);
                const normal = new Vector3(0, 1.0, 0);
    
                positions.push(position.x, position.y, position.z);
                normals.push(normal.x, normal.y, normal.z);
                uvs.push(col / subdivisionsX, CompatibilityOptions.UseOpenGLOrientationForUV ? row / subdivisionsY : 1.0 - row / subdivisionsY);
            }
        }
    
        for (row = 0; row < subdivisionsY; row++) {
            for (col = 0; col < subdivisionsX; col++) {
                indices.push(col + 1 + (row + 1) * (subdivisionsX + 1));
                indices.push(col + 1 + row * (subdivisionsX + 1));
                indices.push(col + row * (subdivisionsX + 1));
    
                indices.push(col + (row + 1) * (subdivisionsX + 1));
                indices.push(col + 1 + (row + 1) * (subdivisionsX + 1));
                indices.push(col + row * (subdivisionsX + 1));
            }
        }
    
        // Result
        const vertexData = new VertexData();
    
        vertexData.indices = indices;
        vertexData.positions = positions;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
    
        return vertexData;
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
    
    stitchChunkMesh( mesh, position, fixRotation ) {
        
        const positions = mesh.getVerticesData( BABYLON.VertexBuffer.PositionKind );

        for ( let i = 0; i < positions.length / 3; i++ ) {
            
            let vertex = new BABYLON.Vector3( positions[ i * 3 ], positions[ i * 3 + 1 ], positions[ i * 3 + 2 ] );
            
            if ( edge === true /*x | z === size / 2*/ ) {

                //if left && do left then stitch left
                //...
            }

            positions[ i * 3 ] = vertex.x;
            positions[ i * 3 + 1 ] = vertex.y;
            positions[ i * 3 + 2 ] = vertex.z;
        }
        
        mesh.updateVerticesData( BABYLON.VertexBuffer.PositionKind, positions );
        mesh.convertToFlatShadedMesh();
    }

}