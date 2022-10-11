"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetQuadtree {

    static divisionSizeFactor = 1.5;

    static INSERT_LIMIT = 48;
    static INSERT_HALF_LIMIT = 16;

    suffix = undefined;

    #planet = null;
    #size = undefined;

    #fixRotationQuaternion = null;

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
        this.#fixRotationQuaternion = fixRotation.scaleInPlace( Math.PI / 2 ).toQuaternion();

        this.#setup1D();
        this.#setup2D();

        this.suffix = suffix;
    }

    insert( params ) {

        this.#recurse( params, this.suffix, this.#up.scale( this.#planet.config.radius ), this.#size );
    }

    #recurse( params, nodeKey, position, size ) {

        const factors = this.#getDistanceDot( params, position );
        
        if ( factors.distance < size * PlanetQuadtree.divisionSizeFactor && size > this.#planet.config.min ) {

            this.#recurseQuad( params, nodeKey, position, size );
            
        } else {

            this.#planet.chunks.node( params, factors, nodeKey, position, this.#fixRotationQuaternion, size, this.#size );
        }
    }

    #recurseQuad( params, nodeKey, position, size ) {

        this.#recurse( params, `${ nodeKey }0`, this.#leftforward.scale( size / 4 ).addInPlace( position ), size / 2 );
        this.#recurse( params, `${ nodeKey }1`, this.#rightforward.scale( size / 4 ).addInPlace( position ), size / 2 );
        this.#recurse( params, `${ nodeKey }2`, this.#leftbackward.scale( size / 4 ).addInPlace( position ), size / 2 );
        this.#recurse( params, `${ nodeKey }3`, this.#rightbackward.scale( size / 4 ).addInPlace( position ), size / 2 );
    }

    #getDistanceDot( params, position ) {

        const terrainifyPosition = PlanetUtils.terrainify( this.#planet, position.clone() );
        const terrainifyWorldRotatePosition = BABYLON.Vector3.TransformCoordinates( terrainifyPosition, this.#planet.root._worldMatrix );
        
        return {
            distance: this.#planet.game.camera.getScreenDistance( undefined, terrainifyWorldRotatePosition ),
            dot: BABYLON.Vector3.Dot( params.centerToInsertion, terrainifyWorldRotatePosition.subtract( this.#planet.position ).normalize() )
        };
    }

    #setup1D() {

        this.#right = BABYLON.Vector3.Right().applyRotationQuaternionInPlace( this.#fixRotationQuaternion );
        this.#up = BABYLON.Vector3.Up().applyRotationQuaternionInPlace( this.#fixRotationQuaternion );
        
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

}