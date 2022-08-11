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

        let material = new BABYLON.StandardMaterial( "planet_material", this.#planet.scene );

        material.diffuseColor = BABYLON.Color3.FromHexString("#FFEFD4");
        material.emissiveColor = BABYLON.Color3.FromHexString("#120B25");
        material.specularColor.set( 0, 0, 0 );

        return material;
    }

    createChunkMesh( nodeKey, position, fixRotation, size, resolution ) {

        let mesh = BABYLON.MeshBuilder.CreateGround( `planet_chunk_${ nodeKey }`, { width: size, height: size, updatable: true, subdivisions: resolution }, this.#planet.scene );
        
        mesh.material = this.#planet.material;
        //mesh.occlusionType = BABYLON.AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC; //glitchy
        mesh.parent = this.#planet.root;
    
        this.updateChunkMesh( mesh, position, fixRotation );

        if ( size == this.#planet.config.min ) {

            //mesh.physicsImpostor = new BABYLON.PhysicsImpostor( mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, this.scene );
            //physicsViewer.showImpostor( mesh.physicsImpostor );
        }
    
        return mesh;
    }
    
    updateChunkMesh( mesh, position, fixRotation ) {
        
        let positions = mesh.getVerticesData( BABYLON.VertexBuffer.PositionKind );
        
        for ( let i = 0; i < positions.length / 3; i++ ) {
            
            let vertex = new BABYLON.Vector3( positions[ i * 3 ], positions[ i * 3 + 1 ], positions[ i * 3 + 2 ] );
    
            vertex = EngineUtils.vectorRotation( vertex, fixRotation );
            
            vertex.addInPlace( position );
    
            vertex = PlanetUtils.terrainify( vertex, this.#planet );
    
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