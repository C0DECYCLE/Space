"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetChunk extends BABYLON.Mesh {

    #planet = null;

    #chunkOffset = null;
    #chunkfixRotQuat = null;
    #chunkSize = undefined;
    #chunkResolution = undefined;
    
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

    get resolution() {

        return this.#chunkResolution;
    }

    /*
    generate( nodeKey, config, neighbors ) {

        this.#removePhysics();

        this.name = `planet${ this.#planet.config.key }_chunk_${ nodeKey }`;

        this.#buildGeometry( config.position, config.fixRotation, config.size, config.resolution, neighbors );
        this.#setupPhysics( config.size );

        return this;
    }
    */
    #setupMesh() {

        this.material = this.#planet.material;
        this.parent = this.#planet.root;
    }

    #setupGeometry( config ) {

        const vertexData = new BABYLON.VertexData();
        vertexData.indices = [];
        vertexData.positions = [];

        this.#buildGeometry( vertexData, config.position, config.fixRotation, config.size, config.resolution, undefined );

        vertexData.applyToMesh( this, true );
        this.convertToFlatShadedMesh();
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

    #buildGeometry( vertexData, offset, fixRotation, size, resolution, neighbors ) {

        this.#chunkOffset = offset;
        this.#chunkfixRotQuat = fixRotation.toQuaternion();
        this.#chunkSize = size;
        this.#chunkResolution = resolution;

        let row;
        let col;
        let position;

        for ( row = 0; row <= resolution; row++ ) {
            for ( col = 0; col <= resolution; col++) {

                position = new BABYLON.Vector3( (col * size) / resolution - size / 2.0, 0, ((resolution - row) * size) / resolution - size / 2.0 );
                position.applyRotationQuaternionInPlace( this.#chunkfixRotQuat );
                position.addInPlace( this.#chunkOffset );
                PlanetUtils.terrainify( this.#planet, position );

                //this.#getEdgeCase( neighbors, row, col, this.#chunkSize, this.#chunkResolution );

                vertexData.positions.push( position.x, position.y, position.z );
            }
        }        

        for ( row = 0; row < resolution; row++ ) {
            for ( col = 0; col < resolution; col++ ) {

                vertexData.indices.push( col + 1 + (row + 1) * (resolution + 1) );
                vertexData.indices.push( col + 1 + row * (resolution + 1) );
                vertexData.indices.push( col + row * (resolution + 1) );
    
                vertexData.indices.push( col + (row + 1) * (resolution + 1) );
                vertexData.indices.push( col + 1 + (row + 1) * (resolution + 1) );
                vertexData.indices.push( col + row * (resolution + 1) );
            }
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