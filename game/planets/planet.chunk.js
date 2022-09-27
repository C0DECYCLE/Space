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

        this.#stitchGeometry( neighbors, this.#size, this.#resolution );
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
        vertexData.applyToMesh( this, true );
    } 

    #setupPhysics( size ) {

        this.#planet.physics.enable( this, size );
    }

    #setupShadow() {
        
        this.#planet.game.star.shadow.cast( this, undefined, undefined, false );        
        this.#planet.game.star.shadow.receive( this, undefined, undefined, false );  
    }

    #buildPositions( offset, fixRotationQuaternion, size, resolution ) {

        let row;
        let col;
        const positions = [];
        let position;

        for ( row = 0; row <= resolution; row++ ) {
            for ( col = 0; col <= resolution; col++) {

                position = new BABYLON.Vector3( (col * size) / resolution - size / 2.0, 0, ((resolution - row) * size) / resolution - size / 2.0 );
                position.applyRotationQuaternionInPlace( fixRotationQuaternion );
                position.addInPlace( offset );
                PlanetUtils.terrainify( this.#planet, position );
                
                positions.push( position.x, position.y, position.z );
            }
        }   
        
        return positions;
    }

    #buildIndices( resolution ) {

        let row;
        let col;
        const indices = [];

        for ( row = 0; row < resolution; row++ ) {
            for ( col = 0; col < resolution; col++ ) {

                indices.push( col + 1 + (row + 1) * (resolution + 1) );
                indices.push( col + 1 + row * (resolution + 1) );
                indices.push( col + row * (resolution + 1) );
    
                indices.push( col + (row + 1) * (resolution + 1) );
                indices.push( col + 1 + (row + 1) * (resolution + 1) );
                indices.push( col + row * (resolution + 1) );
            }
        }

        return indices;
    }

    #stitchGeometry( neighbors, size, resolution ) {

        let row;
        let col;
        const positions = this.getVerticesData( BABYLON.VertexBuffer.PositionKind );
        let position;
        let i = 0;

        for ( row = 0; row <= resolution; row++ ) {
            for ( col = 0; col <= resolution; col++) {

                const edgeCase = this.#getEdgeCase( neighbors, row, col, size, resolution );

                if ( edgeCase !== false ) {

                    position = new BABYLON.Vector3( positions[ i * 3 ], positions[ i * 3 + 1 ], positions[ i * 3 + 2 ] );

                    positions[ i * 3 ] = position.x;
                    positions[ i * 3 + 1 ] = position.y;
                    positions[ i * 3 + 2 ] = position.z;
                }

                i += 3;
            }
        }   
        
        this.updateVerticesData( BABYLON.VertexBuffer.PositionKind, positions );
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