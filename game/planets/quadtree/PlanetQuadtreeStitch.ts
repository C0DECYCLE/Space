/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/
/*
class PlanetQuadtreeStitch implements IPlanetQuadtreeStitch {

    #planet = null;

    constructor( planet ) {
    
        this.#planet = planet;
    }

    stitch( nodeKey, list ) {

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
    
        return `${ nodeKey.charAt(0) }${ nodeKey.substring( 1, ( nodeKey.length - backCut ).clamp( 1, nodeKey.length ) ) || "" }`;
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

}
*/