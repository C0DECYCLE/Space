"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainersSpatialHash {

    list = new Map();

    #containers = null;

    constructor( containers ) {

        this.#containers = containers;
    }

    add( node ) {

        const positionWorld = EngineUtils.getWorldPosition( node );
        const minmax = EngineUtils.getBounding( node ).minmax; 

        const minGrid = ObjectContainerUtils.positionToGrid( minmax.min.add( positionWorld ) );
        const maxGrid = ObjectContainerUtils.positionToGrid( minmax.max.add( positionWorld ) );

        this.#clearNode( node );

        for ( let x = minGrid.x, xl = maxGrid.x; x <= xl; ++x ) {
            
            for ( let y = minGrid.y, yl = maxGrid.y; y <= yl; ++y ) {
            
                for ( let z = minGrid.z, zl = maxGrid.z; z <= zl; ++z ) {
                    log(this.#getOrMake( ObjectContainerUtils.gridToIndex( x, y, z ) ))
                    node.objectcontainers.push( this.#getOrMake( ObjectContainerUtils.gridToIndex( x, y, z ) ).store( node ) );
                }
            }
        }
        if ( ObjectContainerUtils.positionToIndex( positionWorld ) === "-1,0,206" ) log( "a" );
        node.objectcontainer = this.#getOrMake( ObjectContainerUtils.positionToIndex( positionWorld ) );
    }

    get( index ) {

        return this.list.get( index ) || null;
    }

    remove( node ) {

        if ( node.objectcontainers === undefined ) {

            return;
        }

        for ( let i = 0; i < node.objectcontainers.length; i++ ) {

            node.objectcontainers[i].unstore( node );
        }
        
        node.objectcontainers.clear();
        node.objectcontainer = null;
    }

    debug() {
        
        this.list.forEach( objectcontainer => objectcontainer.debug() );
    }

    #clearNode( node ) {

        if ( node.objectcontainers === undefined ) {

            node.objectcontainers = [];

        } else {

            node.clear();
        }
    }

    #getOrMake( index ) {

        let container = this.list.get( index );

        if ( container === undefined ) {

            container = new ObjectContainer( this.#containers, index );

            this.list.set( index, container );
        }

        return container;
    }

}