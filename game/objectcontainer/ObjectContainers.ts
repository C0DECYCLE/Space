/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface Object {

    objectcontainer?: IObjectContainer;

    objectcontainers: IObjectContainer[];

    objectcontainersType?: EObjectContainerTypes; 

    objectcontainersIgnoreMinMax?: boolean;

    objectcontainersGridMinMax: { min: BABYLON.Vector3, max: BABYLON.Vector3 } | null;

}

class ObjectContainers implements IObjectContainers {

    public static TYPES = EObjectContainerTypes;

    public config: IConfig = new Config(  

    );

    public readonly game: IGame;
    public readonly list: Map< string, IObjectContainer > = new Map< string, IObjectContainer >();

    public get mainIndex(): string {

        return this.mainIndexValue;
    }

    public get mainGrid(): BABYLON.Vector3 {

        return this.mainGridValue;
    }
    
    private mainIndexValue: string;
    private mainGridValue: BABYLON.Vector3;

    private dynamicNodes: SmartObjectArray< BABYLON.TransformNode > = new SmartObjectArray< BABYLON.TransformNode >( 100 );
    private debugParent: BABYLON.TransformNode;

    public constructor( game: IGame, config: IConfig ) {

        this.game = game;

        EngineUtils.configure( this, config );
    }

    public addAll( nodes: BABYLON.TransformNode[], type: EObjectContainerTypes = ObjectContainers.TYPES.STATIC, ignoreMinMax: boolean = false ): void {

        nodes.forEach( ( node: BABYLON.TransformNode ): void => this.add( node, type, ignoreMinMax ) );
    }

    public add( node: BABYLON.TransformNode, type: EObjectContainerTypes = ObjectContainers.TYPES.STATIC, ignoreMinMax: boolean = false, positionWorld: BABYLON.Vector3 = EngineUtils.getWorldPosition( node ), gridMinMax?: { min: BABYLON.Vector3, max: BABYLON.Vector3 } ) {
        
        this.addInternal( node, type, ignoreMinMax, positionWorld, gridMinMax || null );

        if ( type === ObjectContainers.TYPES.DYNAMIC ) {

            this.dynamicNodes.add( node );
        }
    }

    public get( index: string ): IObjectContainer | null {

        return this.list.get( index ) || null;
    }

    public move( node: BABYLON.TransformNode ): void {

        if ( node.objectcontainer === undefined || node.objectcontainersGridMinMax === null || node.objectcontainers === undefined ) {

            return;
        }

        const type = node.objectcontainersType;
        const ignoreMinMax = node.objectcontainersIgnoreMinMax;
        const positionWorld = EngineUtils.getWorldPosition( node );
        const gridMinMax = this.getGridMinMax( node, positionWorld );

        if ( ignoreMinMax === true ) {

            if ( ObjectContainerUtils.positionToIndex( positionWorld ) === node.objectcontainer.index ) {

                return;
            }

        } else {

            if ( ObjectContainerUtils.gridToIndex( gridMinMax.min ) === ObjectContainerUtils.gridToIndex( node.objectcontainersGridMinMax.min ) && ObjectContainerUtils.gridToIndex( gridMinMax.max ) === ObjectContainerUtils.gridToIndex( node.objectcontainersGridMinMax.max ) ) {

                return;
            }
        }

        this.removeInternal( node );
        this.addInternal( node, type, ignoreMinMax, positionWorld, gridMinMax );
    }

    public remove( node: BABYLON.TransformNode ): void {

        if ( node.objectcontainers === undefined ) {

            return;
        }
        
        if ( node.objectcontainersType === ObjectContainers.TYPES.DYNAMIC ) {

            this.dynamicNodes.delete( node );
        }

        this.removeInternal( node );
    }

    public update(): void {

        const previousIndex: string = this.mainIndex;
        
        this.mainGridValue = ObjectContainerUtils.positionToGrid( this.game.camera.position );
        this.mainIndexValue = ObjectContainerUtils.gridToIndex( this.mainGrid );

        if ( previousIndex !== this.mainIndex ) {

            this.get( previousIndex )?.onLeave( this.mainIndex );
            this.get( this.mainIndex )?.onEnter( previousIndex );
        }

        this.moveDynamicNodes();
    }

    public debug(): void {
        
        if ( this.debugParent === null ) {

            this.debugParent = new BABYLON.TransformNode( "objectcontainers", this.game.scene );
            this.debugParent.rotationQuaternion = this.debugParent.rotation.toQuaternion();
        }

        this.list.forEach( container => container.debug( this.debugParent ) );
    }

    private moveDynamicNodes(): void {

        for ( let i: number = 0; i < this.dynamicNodes.size; i++ ) {
            
            this.move( this.dynamicNodes[i] );
        }
    }

    private addInternal( node: BABYLON.TransformNode, type: EObjectContainerTypes = ObjectContainers.TYPES.STATIC, ignoreMinMax: boolean = false, positionWorld: BABYLON.Vector3 = EngineUtils.getWorldPosition( node ), gridMinMax: { min: BABYLON.Vector3, max: BABYLON.Vector3 } | null ): void {

        if ( ignoreMinMax === false && gridMinMax === null ) {

            gridMinMax = this.getGridMinMax( node, positionWorld );
        }
        
        this.initializeNode( node, type, ignoreMinMax, gridMinMax );

        if ( ignoreMinMax === false ) {

            if ( gridMinMax === null ) {

                gridMinMax = this.getGridMinMax( node, positionWorld );
            }

            for ( let x: number = gridMinMax.min.x, xl = gridMinMax.max.x; x <= xl; ++x ) {
            
                for ( let y: number = gridMinMax.min.y, yl = gridMinMax.max.y; y <= yl; ++y ) {
                
                    for ( let z: number = gridMinMax.min.z, zl = gridMinMax.max.z; z <= zl; ++z ) {
                        
                        node.objectcontainers.push( this.getOrMake( ObjectContainerUtils.gridToIndex( x, y, z ) ).store( node ) );
                    }
                }
            }
        }
        
        node.objectcontainer = this.getOrMake( ObjectContainerUtils.positionToIndex( positionWorld ) );
    }
    
    private removeInternal( node: BABYLON.TransformNode ): void {

        const onCotainerDispose: (index: string) => void = ( index: string ): void => { this.list.delete( index ) };

        for ( let i: number = 0; i < node.objectcontainers.length; i++ ) {

            node.objectcontainers[i].unstore( node, onCotainerDispose );
        }
        
        this.clearNode( node );
    }

    private initializeNode( node: BABYLON.TransformNode, type: EObjectContainerTypes = ObjectContainers.TYPES.STATIC, ignoreMinMax: boolean = false, gridMinMax: { min: BABYLON.Vector3, max: BABYLON.Vector3 } | null ): void {

        if ( node.objectcontainers === undefined ) {

            node.objectcontainers = [];
        }

        node.objectcontainersType = type;
        node.objectcontainersIgnoreMinMax = ignoreMinMax;
        node.objectcontainersGridMinMax = gridMinMax;
    }

    private clearNode( node: BABYLON.TransformNode ): void {

        node.objectcontainersType = undefined; 
        node.objectcontainersIgnoreMinMax = undefined;
        node.objectcontainersGridMinMax = null;
        node.objectcontainers.clear();
        node.objectcontainer = undefined;
    }
       

    private getOrMake( index: string ): IObjectContainer {

        let container: IObjectContainer | null = this.get( index );

        if ( container === null ) {

            container = new ObjectContainer( this, index );

            this.list.set( index, container );
        }

        return container;
    }

    private getGridMinMax( node: BABYLON.TransformNode, positionWorld: BABYLON.Vector3 ): { min: BABYLON.Vector3, max: BABYLON.Vector3 } {

        const minmax: IBoundingCache = EngineUtils.getBounding( node );
        
        return {

            min: ObjectContainerUtils.positionToGrid( minmax.min.add( positionWorld ) ),
            max: ObjectContainerUtils.positionToGrid( minmax.max.add( positionWorld ) )
        };
    }

}