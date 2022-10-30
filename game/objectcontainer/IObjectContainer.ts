/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IObjectContainer {

    readonly containers: IObjectContainers;
    
    readonly index: string;

    readonly grid: BABYLON.Vector3;
    
    readonly list: SmartObjectArray< BABYLON.Node >;

    get distance(): number;
    
    store( node: BABYLON.Node ): IObjectContainer;

    unstore( node: BABYLON.Node, onDispose?: ( index: string ) => void ): IObjectContainer;

    onEnter( _oldIndex: string ): void;

    onLeave( _newIndex: string ): void;

    debug( parent?: BABYLON.Node ): void;

    dispose(): void;

}