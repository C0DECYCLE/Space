"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetChunk extends BABYLON.Mesh {

    #planet = null;

    #vertexData = null;

    #chunkOffset = null;
    #chunkfixRotQuat = null;
    #chunkSize = undefined;
    #chunkResolution = undefined;
    
    /* override */ constructor( planet, config ) {
    
        super( `planet${ planet.config.key }_chunk_${ config.nodeKey }`, planet.scene );

        this.#planet = planet;

        this.#setupMesh();
        this.#setupGeometry( config.position, config.fixRotation, config.size, config.resolution );
        this.#setupPhysics( config.size );
        this.#setupShadow();
    }

    rebuildChunk( config ) {

        this.#removePhysics();

        this.name = `planet${ planet.config.key }_chunk_${ config.nodeKey }`;

        this.#buildGeometry( config.position, config.fixRotation, config.size, config.resolution );
        this.#setupPhysics( config.size );
    }

    #setupMesh() {

        this.material = this.#planet.material;
        this.parent = this.#planet.root;
    }

    #setupPhysics( size ) {

        this.#planet.physics.enable( this, size );
    }

    #removePhysics() {

        this.#planet.physics.disable( this );
    }

    #setupShadow() {
        
        this.#planet.game.star.shadow.cast( this, undefined, undefined, false );        
        this.#planet.game.star.shadow.receive( this, undefined, undefined, false );  
    }

    #setupGeometry( position, fixRotation, size, resolution, neighbors ) {

        this.#vertexData = new BABYLON.VertexData();
        this.#vertexData.indices = [];
        this.#vertexData.positions = [];

        this.#buildGeometry( position, fixRotation, size, resolution, neighbors );
    } 

    #buildGeometry( offset, fixRotation, size, resolution, neighbors ) {

        this.#chunkOffset = offset;
        this.#chunkfixRotQuat = fixRotation.toQuaternion();
        this.#chunkSize = size;
        this.#chunkResolution = resolution;

        let row;
        let col;
        let i = 0;

        for ( row = 0; row <= resolution; row++ ) {
            for ( col = 0; col <= resolution; col++) {

                const position = new BABYLON.Vector3( (col * size) / resolution - size / 2.0, 0, ((resolution - row) * size) / resolution - size / 2.0 );
    
                position.applyRotationQuaternionInPlace( this.#chunkfixRotQuat );
                position.addInPlace( this.#chunkOffset );
                PlanetUtils.terrainify( this.#planet, position );

                //this.#getEdgeCase( neighbors, row, col, this.#chunkSize, this.#chunkResolution );

                this.#vertexData.positions[i+0] = position.x;
                this.#vertexData.positions[i+1] = position.y;
                this.#vertexData.positions[i+2] = position.z;

                i += 3;
            }
        }        

        this.#vertexData.positions.length = i;
        
        i = 0;

        for ( row = 0; row < resolution; row++ ) {
            for ( col = 0; col < resolution; col++ ) {

                this.#vertexData.indices[i+0] = col + 1 + (row + 1) * (resolution + 1);
                this.#vertexData.indices[i+1] = col + 1 + row * (resolution + 1);
                this.#vertexData.indices[i+2] = col + row * (resolution + 1);
    
                this.#vertexData.indices[i+3] = col + (row + 1) * (resolution + 1);
                this.#vertexData.indices[i+4] = col + 1 + (row + 1) * (resolution + 1);
                this.#vertexData.indices[i+5] = col + row * (resolution + 1);

                i += 6;
            }
        }

        this.#vertexData.indices.length = i;

        this.#vertexData.applyToMesh( this, true );
        this.convertToFlatShadedMesh();
    }

    #getEdgeCase( neighbors, row, col, size, resolution ) {

        const up = row === 0 && neighbors[0] === true;
        const down = row === resolution && neighbors[1] === true;
        const left = col === 0 && neighbors[2] === true;
        const right = col === resolution && neighbors[3] === true;
    
        if ( size < this.#planet.config.radius * 2 && ( up || down || left || right ) && ( row % 2 === 1 || col % 2 === 1 ) ) {
    
            if ( left === true || right === true ) {
    
                return [
                    new BABYLON.Vector3( (col * size) / resolution - size / 2.0, 0, ((resolution - (row - 1)) * size) / resolution - size / 2.0 ),
                    new BABYLON.Vector3( (col * size) / resolution - size / 2.0, 0, ((resolution - (row + 1)) * size) / resolution - size / 2.0 ) 
                ];

            } else if ( up === true || down === true ) {
    
                return [
                    new BABYLON.Vector3( ((col - 1) * size) / resolution - size / 2.0, 0, ((resolution - row) * size) / resolution - size / 2.0 ),
                    new BABYLON.Vector3( ((col + 1) * size) / resolution - size / 2.0, 0, ((resolution - row) * size) / resolution - size / 2.0 ) 
                ];
            }
        }
    
        return false;
    }
}