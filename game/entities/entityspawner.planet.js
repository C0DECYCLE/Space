"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EntitySpawner {

    config = {

        seed: undefined,
        
        density: 0.04,
    }

    planet = null;

    list = [];

    #perlin = null;

    #pre_filters = [];
    #post_filters = [];

    constructor( planet, config ) {
        
        this.planet = planet;

        EngineUtils.configure.call( this, config );

        this.#setupPerlin();
    }

    addPreFilter( prefilter ) {

        this.#pre_filters.push( prefilter );
    }

    addPostFilter( filter ) {

        this.#post_filters.push( filter );
    }

    spawn() {

        const planetSurfaceArea = 4 * Math.PI * this.planet.config.radius;
        const n = Math.floor( planetSurfaceArea * this.config.density );
        
        for ( let i = 0; i < n; i++ ) {

            this.#evaluate( this.#getPosition( i, n ), n );
        }
    }

    create( pposition, n, varyings ) {

        return null;
    }

    noise( vector ) {

        if ( typeof vector === "number" ) {

            return this.#perlin.get( vector, vector, vector );
        }

        return this.#perlin.get( vector.x, vector.y, vector.z );
    }

    #setupPerlin() {

        this.config.seed = this.config.seed || this.planet.config.seed.y;

        this.#perlin = new perlinNoise3d();
        this.#perlin.noiseSeed( this.config.seed );
    }
    
    #getPosition( i, n ) {

        const theta = 2 * Math.PI * i / PHI;
        const phi = Math.acos( 1 - 2 * ( i + 0.5 ) / n );

        return new BABYLON.Vector3( Math.cos( theta ) * Math.sin( phi ), Math.sin( theta ) * Math.sin( phi ), Math.cos( phi ) ); 
    }

    #evaluate( position, n ) {

        const pretest = this.#test( this.#pre_filters, [ position ] );

        if ( pretest !== false ) {
            
            const creation = this.create( position, n, pretest );

            if ( this.#test( this.#post_filters, creation ) !== false ) {
            
                this.list.push( creation[0] );
            }
        }
    }

    #test( filter, args ) {

        let varyings = {};

        for ( let i = 0; i < filter.length; i++ ) {

            const result = filter[i]( ...args );

            if ( result === false ) {

                return false;
            }

            Object.assign( varyings, result );
        }

        return varyings;
    }

}