"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainers {

    config = {

    };

    game = null;

    #list = new Map();
    #mainIndex = undefined;
    #mainGrid = null;
    #debugParent = null;

    constructor( game, config ) {

        this.game = game;

        EngineUtils.configure.call( this, config );
    }

    get list() {

        return this.#list;
    }

    get mainIndex() {

        return this.#mainIndex;
    }

    get mainGrid() {

        return this.#mainGrid;
    }

    addAll( nodes ) {

        nodes.forEach( node => this.add( node ) );
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
        
        node.objectcontainer = this.#getOrMake( ObjectContainerUtils.positionToIndex( EngineUtils.getWorldPosition( node ) ) );
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

    update() {

        const previousIndex = this.#mainIndex;
        
        this.#mainGrid = ObjectContainerUtils.positionToGrid( this.game.camera.position );
        this.#mainIndex = ObjectContainerUtils.gridToIndex( this.#mainGrid );

        if ( previousIndex !== this.#mainIndex ) {

            this.get( previousIndex )?.onLeave( this.#mainIndex );
            this.get( this.#mainIndex )?.onEnter( previousIndex );
        }
    }

    debug() {
        
        if ( this.#debugParent === null ) {

            this.#debugParent = new BABYLON.TransformNode( "objectcontainers", this.game.scene );
            this.#debugParent.rotationQuaternion = this.#debugParent.rotation.toQuaternion();
        }

        this.list.forEach( objectcontainer => objectcontainer.debug( this.#debugParent ) );
    }

    #clearNode( node ) {

        if ( node.objectcontainers === undefined ) {

            node.objectcontainers = [];

        } else {

            node.clear();
        }
    }

    #getOrMake( index ) {

        let container = this.get( index );

        if ( container === null ) {

            container = new ObjectContainer( this, index );

            this.list.set( index, container );
        }

        return container;
    }

}