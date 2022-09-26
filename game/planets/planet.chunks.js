"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetChunks {
 
    #planet = null;
    
    #nodes = new Map();
    #pool = new ObjectArray();

    constructor( planet ) {

        this.#planet = planet;
    }

    insertQuadtrees( distance ) {
        
        this.#unkeepAll();
        this.#doQuadtree( distance );
        this.#doChunks();
    }

    node( params, factors, nodeKey, position, fixRotation, size, faceSize ) {

        if ( factors.dot > params.occlusionFallOf ) {
                
            this.#evalNode( params, nodeKey, position, fixRotation, size, faceSize );
        }
    }

    #unkeepAll() {

        this.#nodes.forEach( ( data, nodeKey ) => {
            
            data.keep = false;
        } );
    }

    #doQuadtree( distance ) {
        
        const params = { 
            
            distanceCenterInsertion: distance,
            distanceRadiusFactor: distance / this.#planet.config.radius,

            centerToInsertion: this.#planet.game.camera.position.subtract( this.#planet.position ).normalize(),
            occlusionFallOf: ( 1 - ( (distance / this.#planet.config.radius) - 1 ) ).clamp( -1.05, 0.95 )
        };

        this.#planet.faces.forEach( ( face, suffic ) => face.insert( params ) );
    }

    #evalNode( params, nodeKey, position, fixRotation, size, faceSize ) {

        const resolution = this.#getResolution( params, size, faceSize );
        const node = this.#nodes.get( nodeKey );
        
        if ( node !== undefined ) {

            if ( node.resolution === resolution ) {

                node.keep = true;
            }

        } else {

            this.#nodes.set( nodeKey, { keep: true, chunk: this.#getChunk(),
                position: position, fixRotation: fixRotation, size: size, resolution: resolution
            } ); 
        }
    }

    #getResolution( params, size, faceSize ) {
        
        if ( size >= faceSize ) { 
            
            if ( params.distanceRadiusFactor > PlanetQuadtree.INSERT_LIMIT ) {

                return this.#planet.config.resolution / 4;
                
            } else if ( params.distanceRadiusFactor > PlanetQuadtree.INSERT_HALF_LIMIT ) {

                return this.#planet.config.resolution / 2;
            }
        }

        return this.#planet.config.resolution;
    }

    #getChunk() {

        if ( this.#pool.length > 0 ) {

            const chunk = this.#pool.pop();
            chunk.setEnabled( true );
            return chunk;

        } else {

            return new PlanetChunk( this.#planet );
        }
    }

    #doChunks() {

        this.#nodes.forEach( ( data, nodeKey ) => {
            
            if ( data.keep === false ) {
                
                this.#removeNode( nodeKey, data );

            } else {

                this.#makeChunk( nodeKey, data );
            }
        } ); 
    }

    #removeNode( nodeKey, data ) {

        data.chunk.setEnabled( false );
        this.#pool.add( data.chunk );
        this.#nodes.delete( nodeKey );
    }

    #makeChunk( nodeKey, data ) {

        //compute neighbors
        const neighbors = undefined; 
        data.chunk.generate( nodeKey, data, neighbors );
    }

}