"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetChunks {
 
    #planet = null;
    
    #nodes = new Map();

    constructor( planet ) {

        this.#planet = planet;
    }

    insertQuadtrees( distance ) {
        
        this.#doQuadtree( distance );
        this.#doChunks();
    }

    node( params, dot, nodeKey, position, fixRotationQuaternion, size, faceSize ) {

        if ( dot > params.occlusionFallOf ) {
                
            this.#evalNode( params, nodeKey, position, fixRotationQuaternion, size, faceSize );
        }
    }

    toggleShadows( value ) {

        this.#nodes.forEach( ( data, nodeKey ) => data.chunk.toggleShadow( value ) );
    }

    #doQuadtree( distance ) {
        
        const params = { 
            
            distanceCenterInsertion: distance,
            distanceRadiusFactor: distance / this.#planet.config.radius,

            centerToInsertion: this.#planet.game.camera.position.subtract( this.#planet.position ).normalize(),
            occlusionFallOf: this.#planet.helper.getOcclusionFallOf( distance )
        };
        
        this.#planet.faces.forEach( ( face, suffic ) => face.insert( params ) );
    }

    #evalNode( params, nodeKey, position, fixRotationQuaternion, size, faceSize ) {

        const resolution = this.#getResolution( params, size, faceSize );
        const node = this.#nodes.get( nodeKey );
        
        if ( node !== undefined ) {

            if ( node.chunk.resolution === resolution ) {

                node.keep = true;
            }

        } else {

            this.#nodes.set( nodeKey, { keep: true, chunk: new PlanetChunk( this.#planet, nodeKey, { position: position, fixRotationQuaternion: fixRotationQuaternion, size: size, resolution: resolution } ) } ); 
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

    #doChunks() {

        this.#nodes.forEach( ( data, nodeKey ) => {
            
            if ( data.keep === false ) {
                
                this.#disposeNode( nodeKey, data );

            } else {

                //this.#stitchNode( nodeKey, data );
            }
            
            data.keep = false;
        } ); 
    }

    #stitchNode( nodeKey, data ) {

        //compute neighbors
        const neighbors = this.#planet.stitch.stitch( nodeKey, this.#nodes ); 
        if ( neighbors !== undefined ) data.chunk.stitch( neighbors );
    }

    #disposeNode( nodeKey, data ) {

        data.chunk.dispose();
        this.#nodes.delete( nodeKey );
    }

}