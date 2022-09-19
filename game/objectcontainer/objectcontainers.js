"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainers {

    static TYPES = {

        STATIC: 0,
        DYNAMIC: 1
    };

    config = {

    };

    game = null;

    #list = new Map();
    #mainIndex = undefined;
    #mainGrid = null;
    #dynamicNodes = new ObjectArray();
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

    addAll( nodes, type = ObjectContainers.TYPES.STATIC, ignoreMinMax = false ) {

        nodes.forEach( node => this.add( node, type, ignoreMinMax ) );
    }

    add( node, type = ObjectContainers.TYPES.STATIC, ignoreMinMax = false, positionWorld = EngineUtils.getWorldPosition( node ), gridMinMax = null ) {
        
        this.#addInternal( node, type, ignoreMinMax, positionWorld, gridMinMax );

        if ( type === ObjectContainers.TYPES.DYNAMIC ) {

            this.#dynamicNodes.add( node );
        }
    }

    get( index ) {

        return this.list.get( index ) || null;
    }

    move( node ) {

        if ( node.objectcontainers === undefined ) {

            return;
        }

        const type = node.objectcontainers.type;
        const ignoreMinMax = node.objectcontainers.ignoreMinMax;
        const positionWorld = EngineUtils.getWorldPosition( node );
        const gridMinMax = this.#getGridMinMax( node, positionWorld );

        if ( ignoreMinMax === true ) {

            if ( ObjectContainerUtils.positionToIndex( positionWorld ) === node.objectcontainer.index ) {

                return;
            }

        } else {

            if ( ObjectContainerUtils.gridToIndex( gridMinMax.min ) === ObjectContainerUtils.gridToIndex( node.objectcontainers.gridMinMax.min ) && ObjectContainerUtils.gridToIndex( gridMinMax.max ) === ObjectContainerUtils.gridToIndex( node.objectcontainers.gridMinMax.max ) ) {

                return;
            }
        }

        this.#removeInternal( node );
        this.#addInternal( node, type, ignoreMinMax, positionWorld, gridMinMax );
    }

    remove( node ) {

        if ( node.objectcontainers === undefined ) {

            return;
        }
        
        if ( node.objectcontainers.type === ObjectContainers.TYPES.DYNAMIC ) {

            this.#dynamicNodes.delete( node );
        }

        this.#removeInternal( node );
    }

    update() {

        const previousIndex = this.#mainIndex;
        
        this.#mainGrid = ObjectContainerUtils.positionToGrid( this.game.camera.position );
        this.#mainIndex = ObjectContainerUtils.gridToIndex( this.#mainGrid );

        if ( previousIndex !== this.#mainIndex ) {

            this.get( previousIndex )?.onLeave( this.#mainIndex );
            this.get( this.#mainIndex )?.onEnter( previousIndex );
        }

        this.#moveDynamicNodes();
    }

    debug() {
        
        if ( this.#debugParent === null ) {

            this.#debugParent = new BABYLON.TransformNode( "objectcontainers", this.game.scene );
            this.#debugParent.rotationQuaternion = this.#debugParent.rotation.toQuaternion();
        }

        this.list.forEach( container => container.debug( this.#debugParent ) );
    }

    #addInternal( node, type = ObjectContainers.TYPES.STATIC, ignoreMinMax = false, positionWorld = EngineUtils.getWorldPosition( node ), gridMinMax = null ) {

        if ( ignoreMinMax === false && gridMinMax === null ) {

            gridMinMax = this.#getGridMinMax( node, positionWorld );
        }
        
        this.#initializeNode( node, type, ignoreMinMax, gridMinMax );

        if ( ignoreMinMax === false ) {

            for ( let x = gridMinMax.min.x, xl = gridMinMax.max.x; x <= xl; ++x ) {
            
                for ( let y = gridMinMax.min.y, yl = gridMinMax.max.y; y <= yl; ++y ) {
                
                    for ( let z = gridMinMax.min.z, zl = gridMinMax.max.z; z <= zl; ++z ) {
                        
                        node.objectcontainers.push( this.#getOrMake( ObjectContainerUtils.gridToIndex( x, y, z ) ).store( node ) );
                    }
                }
            }
        }
        
        node.objectcontainer = this.#getOrMake( ObjectContainerUtils.positionToIndex( positionWorld ) );
    }
    
    #removeInternal( node ) {

        const onCotainerDispose = index => this.#onContainerDispose( index );

        for ( let i = 0; i < node.objectcontainers.length; i++ ) {

            node.objectcontainers[i].unstore( node, onCotainerDispose );
        }
        
        this.#clearNode( node );
    }

    #initializeNode( node, type = ObjectContainers.TYPES.STATIC, ignoreMinMax = false, gridMinMax = null ) {

        if ( node.objectcontainers === undefined ) {

            node.objectcontainers = [];
        }

        node.objectcontainers.type = type;
        node.objectcontainers.ignoreMinMax = ignoreMinMax;
        node.objectcontainers.gridMinMax = gridMinMax;
    }

    #clearNode( node ) {

        node.objectcontainers.type = undefined; 
        node.objectcontainers.ignoreMinMax = undefined;
        node.objectcontainers.gridMinMax = null;
        node.objectcontainers.clear();
        node.objectcontainer = null;
    }
       

    #getOrMake( index ) {

        let container = this.get( index );

        if ( container === null ) {

            container = new ObjectContainer( this, index );

            this.list.set( index, container );
        }

        return container;
    }

    #getGridMinMax( node, positionWorld ) {

        const minmax = EngineUtils.getBounding( node );
        
        return {

            min: ObjectContainerUtils.positionToGrid( minmax.min.add( positionWorld ) ),
            max: ObjectContainerUtils.positionToGrid( minmax.max.add( positionWorld ) )
        };
    }

    #moveDynamicNodes() {

        for ( let i = 0; i < this.#dynamicNodes.length; i++ ) {
            
            this.move( this.#dynamicNodes[i] );
        }
    }

    #onContainerDispose( index ) {

        this.list.delete( index );
    }

}