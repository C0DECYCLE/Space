"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetChunks {
 
    #planet = null;
    
    #nodes = new Map();
    #list = new Map();

    constructor( planet ) {

        this.#planet = planet;
    }

    insertQuadtrees( distance ) {
        
        this.#unkeepAll();
        this.#generate( distance );
        this.#disposeAndStitch();
    }

    #unkeepAll() {

        this.#nodes.forEach( ( data, nodeKey ) => {
            
            data.keep = false;
        } );
    }

    #generate( distance ) {
        
        const params = { 
            
            distanceCenterInsertion: distance,
            distanceRadiusFactor: distance / this.#planet.config.radius,

            centerToInsertion: this.#planet.game.camera.position.subtract( this.position ).normalize(),
            occlusionFallOf: ( 1 - ( (distance / this.#planet.config.radius) - 1 ) ).clamp( -1.05, 0.95 )
        };

        this.#planet.faces.forEach( ( face, suffic ) => face.insert( params ) );
    }

    #disposeAndStitch() {

        this.#nodes.forEach( ( data, nodeKey ) => {
            
            if ( data.keep === false ) {
                
                this.#disposeNode( nodeKey, data );

            } else {

                this.#planet.faces.get( nodeKey[0] ).stitch( nodeKey, this.#nodes, data );
            }
        } ); 
        
        /*data.retired = true; data.mesh.setEnabled( false );*/ 
    }

    #disposeNode( nodeKey, data ) {

        //this.#planet.game.star.shadow.cast( data.mesh, false, undefined, false );        
        //this.#planet.game.star.shadow.receive( data.mesh, false, undefined, false );  

        //data.mesh.dispose( !true, false );
        //this.#list.delete( nodeKey );
    }

    evaluateNode( params, nodeKey, position, size, factors ) {

        //if ( factors.dot > params.occlusionFallOf ) {
                
            const resolution = this.#getResolution( params, size );
            
            if ( this.#nodes.has( nodeKey ) === true ) {

                this.#keepNode( params, nodeKey, resolution );

            } else {

                this.#makeNode( params, nodeKey, position, size, factors, resolution );
            }
        //}
    }

    #getResolution( params, size ) {
        
        if ( size >= this.#size ) { 
            
            if ( params.distanceRadiusFactor > PlanetQuadtree.INSERT_LIMIT ) {

                return this.#planet.config.resolution / 4;
                
            } else if ( params.distanceRadiusFactor > PlanetQuadtree.INSERT_HALF_LIMIT ) {

                return this.#planet.config.resolution / 2;
            }
        }

        return this.#planet.config.resolution;
    }

    #keepNode( params, nodeKey, resolution ) {

        const node = this.#nodes.get( nodeKey );
            
        if ( node.resolution === resolution ) {

            node.keep = true;
        }
    }

    #makeNode( params, nodeKey, position, size, factors, resolution ) {

        this.#nodes.set( nodeKey, {

            keep: true,

            resolution: resolution,
            mesh: new PlanetChunk( this.#planet, { nodeKey: nodeKey, position: position, fixRotation: this.#fixRotation, size: size, resolution: resolution } )
        } ); 
    }

}