"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetQuadtree {

    static INSERT_LIMIT = 48;
    static INSERT_HALF_LIMIT = 16;

    suffix = undefined;

    #planet = null;
    #size = undefined;

    #fixRotation = null;

    #up = null;
    #left = null;
    #right = null;
    #forward = null;
    #backward = null;

    #leftforward = null;
    #rightforward = null;
    #leftbackward = null;
    #rightbackward = null;

    constructor( planet, suffix, fixRotation ) {
    
        this.#planet = planet;

        this.#size = this.#planet.config.radius * 2;
        this.#fixRotation = fixRotation.scaleInPlace( Math.PI / 2 );

        this.#setup1D();
        this.#setup2D();

        this.suffix = suffix;
    }

    insert( params ) {

        this.#recurse( params, this.suffix, this.#up.scale( this.#planet.config.radius ), this.#size );
    }

    #setup1D() {

        this.#right = EngineUtils.vectorRotation( BABYLON.Vector3.Right(), this.#fixRotation );
        this.#up = EngineUtils.vectorRotation( BABYLON.Vector3.Up(), this.#fixRotation );
        
        this.#forward = BABYLON.Vector3.Cross( this.#right, this.#up );
        this.#left = this.#right.negate();
        this.#backward = this.#forward.negate();
    }

    #setup2D() {

        this.#leftforward = this.#left.add( this.#forward );
        this.#rightforward = this.#right.add( this.#forward );
        this.#leftbackward = this.#backward.add( this.#left );
        this.#rightbackward = this.#backward.add( this.#right );
    }

    #recurse( params, nodeKey, position, size ) {

        const factors = this.#getDistanceDot( params, position );
        
        if ( factors.distance < size * 1.5 && size > this.#planet.config.min ) {

            this.#recurseQuad( params, nodeKey, position, size );
            
        } else {

            this.#evaluateNode( params, nodeKey, position, size, factors );
        }
    }

    #recurseQuad( params, nodeKey, position, size ) {

        this.#recurse( params, `${ nodeKey }0`, this.#leftforward.scale( size / 4 ).addInPlace( position ), size / 2 );
        this.#recurse( params, `${ nodeKey }1`, this.#rightforward.scale( size / 4 ).addInPlace( position ), size / 2 );
        this.#recurse( params, `${ nodeKey }2`, this.#leftbackward.scale( size / 4 ).addInPlace( position ), size / 2 );
        this.#recurse( params, `${ nodeKey }3`, this.#rightbackward.scale( size / 4 ).addInPlace( position ), size / 2 );
    }

    #evaluateNode( params, nodeKey, position, size, factors ) {

        if ( factors.dot > params.occlusionFallOf ) {
                
            const resolution = this.#getResolution( params, size );
            
            if ( params.list.has( nodeKey ) == true ) {

                this.#keepNode( params, nodeKey, resolution );

            } else {

                this.#makeNode( params, nodeKey, position, size, factors, resolution );
            }
        }
    }

    #keepNode( params, nodeKey, resolution ) {

        const node = params.list.get( nodeKey );
            
        if ( node.resolution == resolution ) {

            node.keep = true;
        }
    }

    #makeNode( params, nodeKey, position, size, factors, resolution ) {

        params.list.set( nodeKey, {

            keep: true,

            resolution: resolution,
            mesh: this.#planet.generator.createChunkMesh( nodeKey, position, this.#fixRotation, size, resolution, factors.distance )
        } );
    }

    #getDistanceDot( params, position ) {

        const terrainifyPosition = PlanetUtils.terrainify( this.#planet, position.clone() );
        const terrainifyOriginRotatePosition = BABYLON.Vector3.TransformCoordinates( terrainifyPosition, this.#planet.root.computeWorldMatrix( true ) );
        
        return {

            distance: BABYLON.Vector3.Distance( terrainifyOriginRotatePosition, params.insertposition ),

            dot: BABYLON.Vector3.Dot( params.centerToInsertion, terrainifyOriginRotatePosition.subtract( this.#planet.root.position ).normalize() )
        };
    }

    #getResolution( params, size ) {
        
        if ( size >= this.#size ) { 
            
            if ( params.distanceRadiusFactor > PlanetQuadtree.INSERT_LIMIT - 1 ) {

                return this.#planet.config.resolution / 4;
                
            } else if ( params.distanceRadiusFactor > PlanetQuadtree.INSERT_HALF_LIMIT ) {

                return this.#planet.config.resolution / 2;
            }
        }

        return this.#planet.config.resolution;
    }

}