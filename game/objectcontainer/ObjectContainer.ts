/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainer implements IObjectContainer {

    public static readonly size: number = 512;

    public readonly containers: IObjectContainers;
    
    public readonly index: string;
    public readonly grid: BABYLON.Vector3;
    public readonly list: SmartObjectArray< BABYLON.Node > = new SmartObjectArray< BABYLON.Node >( 100 );

    public get distance(): number {

        this.preventDisposed();
        
        if ( this.distanceCache === undefined || this.cacheMainIndex !== this.containers.mainIndex ) {

            this.distanceCache = this.getDistance();
            this.cacheMainIndex = this.containers.mainIndex;
        }

        return this.distanceCache;
    }
    
    private isDisposed: boolean = false;
    private distanceCache: number;
    private cacheMainIndex: string;
    private debugMesh: BABYLON.Mesh;

    public constructor( containers: IObjectContainers, index: string ) {
        
        this.containers = containers;
        this.index = index;
        this.grid = ObjectContainerUtils.indexToGrid( this.index );
    }

    public store( node: BABYLON.Node ): IObjectContainer {

        this.preventDisposed();
        
        this.list.add( node );

        return this;
    }

    public unstore( node: BABYLON.Node, onDispose?: ( index: string ) => void ): IObjectContainer {

        this.preventDisposed();

        this.list.delete( node );

        if ( this.list.size === 0 ) {

            onDispose?.( this.index );
            this.dispose();
        }

        return this;
    }

    public onEnter( _oldIndex: string ): void {
        /*
        this.#preventDisposed();
        */
    }

    public onLeave( _newIndex: string ): void {
        /*
        this.#preventDisposed();
        */
    }

    public debug( parent?: BABYLON.Node ): void {

        this.preventDisposed();

        if ( this.debugMesh === undefined ) {

            const scene = this.containers.game.scene;

            this.debugMesh = BABYLON.MeshBuilder.CreateBox( `objectcontainer_${ this.index }`, { size: ObjectContainer.size }, scene );
            this.debugMesh.isPickable = false;
            this.debugMesh.material = scene.debugMaterialWhite;
            this.debugMesh.position.copyFrom( ObjectContainerUtils.indexToApproximatePosition( this.index ) );

            if ( parent instanceof BABYLON.Node ) {

                this.debugMesh.parent = parent;
            }
        }
    }

    public dispose(): void {

        this.isDisposed = true;
        this.list.clear();
    }

    private getDistance(): number {
        
        return BABYLON.Vector3.Distance( this.containers.mainGrid, this.grid ) * ObjectContainer.size;
    }

    private preventDisposed(): void {

        if ( this.isDisposed === true ) {

            console.error( "ObjectContainer: Container is disposed!" );
        }
    }

}