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
    
    /////////////////////////////////////////////////////////
    stitch( nodeKey, list, data ) {

        if ( nodeKey.length === 1 || nodeKey.length === 2 ) {

            return;
        }

        const last = this.#getHash( nodeKey, 1 );
        const seclast = this.#getHash( nodeKey, 2 );
        const thilast = this.#getHash( nodeKey, 3 );
        
        const hasSecVer = list.has( `${ this.#getKeyCut( nodeKey, 2 ) }${ this.#invVer( seclast ) }` );
        const hasThiVer = list.has( `${ this.#getKeyCut( nodeKey, 3 ) }${ this.#invVer( thilast ) || "" }${ this.#invVer( seclast ) }` );
        const hasSecHor = list.has( `${ this.#getKeyCut( nodeKey, 2 ) }${ this.#invHor( seclast ) }` );
        const hasThiHor = list.has( `${ this.#getKeyCut( nodeKey, 3 ) }${ this.#invHor( thilast ) || "" }${ this.#invHor( seclast ) }` );
        
        let doLeft = last === 1 || last === 3 ? false : this.#hasBiggerNeighbor( seclast, "l", hasSecVer, hasThiVer, hasSecHor, hasThiHor );
        let doRight = last === 0 || last === 2 ? false : this.#hasBiggerNeighbor( seclast, "r", hasSecVer, hasThiVer, hasSecHor, hasThiHor );
        let doTop = last === 2 || last === 3 ? false : this.#hasBiggerNeighbor( seclast, "t", hasSecVer, hasThiVer, hasSecHor, hasThiHor );
        let doBottom = last === 0 || last === 1 ? false : this.#hasBiggerNeighbor( seclast, "b", hasSecVer, hasThiVer, hasSecHor, hasThiHor );

        return [ doTop, doBottom, doLeft, doRight ];
    }

    #getHash( nodeKey, backIndex ) {

        return Number( nodeKey.charAt( nodeKey.length - backIndex ) );
    }

    #getKeyCut( nodeKey, backCut ) {

        return `${ this.suffix }${ nodeKey.substring( 1, ( nodeKey.length - backCut ).clamp( 1, nodeKey.length ) ) || "" }`;
    }

    #hasBiggerNeighbor( seclast, side, hasSecVer, hasThiVer, hasSecHor, hasThiHor ) {
        
        if ( side === "t" ) {
            
            return seclast === 2 || seclast === 3 ? hasSecVer : hasThiVer;

        } else if ( side === "b" ) { 

            return seclast === 0 || seclast === 1 ? hasSecVer : hasThiVer;

        } else if ( side === "l" ) { 

            return seclast === 1 || seclast === 3 ? hasSecHor : hasThiHor;

        } else if ( side === "r" ) { 

            return seclast === 0 || seclast === 2 ? hasSecHor : hasThiHor;
        }
    }

    #invVer( hash ) {

        return ( hash + 2 ) % 4;
    }
    
    #invHor( hash ) {

        switch ( hash ) {

            case 0: return 1;
            case 1: return 0;
            case 2: return 3;
            case 3: return 2;
        }
    }
    //////////////////////////////////////////////////////////

    #recurse( params, nodeKey, position, size ) {

        const factors = this.#getDistanceDot( params, position );
        
        if ( factors.distance < size * 1.5 && size > this.#planet.config.min ) {

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
        const terrainifyWorldRotatePosition = BABYLON.Vector3.TransformCoordinates( terrainifyPosition, this.#planet.root.computeWorldMatrix( true ) );
        
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