"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetChunk extends BABYLON.Mesh {

    #planet = null;
    
    #size = undefined;
    #resolution = undefined;
    
    /* override */ constructor( planet, nodeKey, config ) {
    
        super( `planet${ planet.config.key }_chunk_${ nodeKey }`, planet.scene );
        this._setReady( false );

        this.#planet = planet;

        this.#setupMesh();
        this.#setupGeometry( config );

        this._setReady( true );

        this.#setupShadow();
        this.#setupPhysics( config.size );
    }

    get size() {

        return this.#size;
    }

    get resolution() {

        return this.#resolution;
    }

    stitch( neighbors ) {

        //this.#stitchGeometry( neighbors, this.#size, this.#resolution );
    }

    /* override */ dispose() {
    
        this.#removeShadow();
        super.dispose( ...arguments );
    }

    #setupMesh() {

        this.material = this.#planet.material;
        this.parent = this.#planet.root;
    }

    #setupGeometry( config ) {

        this.#size = config.size;
        this.#resolution = config.resolution;

        const vertexData = new BABYLON.VertexData();
        vertexData.positions = this.#buildPositions( config.position, config.fixRotationQuaternion, config.size, config.resolution );
        vertexData.indices = this.#buildIndices( config.resolution ); 
        //
        //vertexData.normals = []; BABYLON.VertexData.ComputeNormals( vertexData.positions, vertexData.indices, vertexData.normals );
        //
        vertexData.applyToMesh( this, true );
    } 

    #setupPhysics( size ) {

        this.#planet.physics.enable( this, size );
    }

    #setupShadow() {
        
        this.#planet.game.star.shadow.cast( this, undefined, undefined, false );        
        this.#planet.game.star.shadow.receive( this, undefined, undefined, false );  
    }

    #removeShadow() {

        this.#planet.game.star.shadow.cast( this, false, undefined, false );        
        this.#planet.game.star.shadow.receive( this, false, undefined, false );  
    }

    #buildPositions( offset, fixRotationQuaternion, size, resolution ) {

        let row;
        let col;
        const positions = new Float32Array( (resolution+1) * (resolution+1) * 3 );
        let position;
        let i = 0;

        for ( row = 0; row <= resolution; row++ ) {
            for ( col = 0; col <= resolution; col++) {

                position = new BABYLON.Vector3( (col * size) / resolution - size / 2.0, 0, ((resolution - row) * size) / resolution - size / 2.0 );
                position.applyRotationQuaternionInPlace( fixRotationQuaternion );
                position.addInPlace( offset );
                PlanetUtils.terrainify( this.#planet, position );

                positions[i] = position.x;
                positions[i+1] = position.y;
                positions[i+2] = position.z;

                i += 3;
            }
        }   
        
        return positions;
    }

    #buildIndices( resolution ) {

        let row;
        let col;
        const indices = new Uint16Array( resolution * resolution * 6 );
        let i = 0;

        for ( row = 0; row < resolution; row++ ) {
            for ( col = 0; col < resolution; col++ ) {

                indices[i] = col + 1 + (row + 1) * (resolution + 1);
                indices[i+1] = col + 1 + row * (resolution + 1);
                indices[i+2] = col + row * (resolution + 1);

                indices[i+3] = col + (row + 1) * (resolution + 1);
                indices[i+4] = col + 1 + (row + 1) * (resolution + 1);
                indices[i+5] = col + row * (resolution + 1);

                i += 6;
            }
        }

        return indices;
    }

    #stitchGeometry( neighbors, size, resolution ) {

        let row;
        let col;
        const positions = this.getVerticesData( BABYLON.VertexBuffer.PositionKind );

        for ( row = 1; row <= resolution-1; row += 2 ) {
            for ( col = 0; col <= resolution; col += resolution ) {

                this.#stitchVertex( positions, neighbors, row, col, size, resolution );
            }
        }

        for ( col = 1; col <= resolution-1; col += 2 ) {
            for ( row = 0; row <= resolution; row += resolution ) {

                this.#stitchVertex( positions, neighbors, row, col, size, resolution );
            }
        }
        
        this.updateVerticesData( BABYLON.VertexBuffer.PositionKind, positions );
    }

    #stitchVertex( positions, neighbors, row, col, size, resolution ) {

        const edgeCase = this.#getEdgeCase( neighbors, row, col, size, resolution );

        if ( edgeCase !== false ) {
            
            const i = (row * (resolution+1) + col ) * 3;
            const position = new BABYLON.Vector3( positions[i], positions[i+1], positions[i+2] );

            position.scaleInPlace( 1.01 );

            positions[i] = position.x;
            positions[i+1] = position.y;
            positions[i+2] = position.z;
        }
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