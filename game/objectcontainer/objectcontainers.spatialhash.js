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

        const minmax = EngineUtils.getBounding( node ).minmax;
        const minGrid = ObjectContainerUtils.positionToGrid( minmax.min );
        const maxGrid = ObjectContainerUtils.positionToGrid( minmax.max );

        this.#clearNode( node );

        for ( let x = minGrid.x, xl = maxGrid.x; x <= xl; ++x ) {
            
            for ( let y = minGrid.y, yl = maxGrid.y; y <= yl; ++y ) {
            
                for ( let z = minGrid.z, zl = maxGrid.z; z <= zl; ++z ) {
                    
                    node.objectcontainers.push( this.#getOrMake( ObjectContainerUtils.gridToIndex( x, y, z ) ).store( node ) );
                }
            }
        }

        node.objectcontainer = this.#getOrMake( ObjectContainerUtils.positionToIndex( node.position ) );
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