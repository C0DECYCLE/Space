/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IObjectContainers extends IConfigurable {

    readonly game: IGame;

    readonly list: Map< string, IObjectContainer >;

    get mainIndex(): string;

    get mainGrid(): BABYLON.Vector3;
    
    addAll( nodes: BABYLON.TransformNode[], type?: EObjectContainerTypes, ignoreMinMax?: boolean ): void;

    add( node: BABYLON.TransformNode, type?: EObjectContainerTypes, ignoreMinMax?: boolean, positionWorld?: BABYLON.Vector3, gridMinMax?: { min: BABYLON.Vector3, max: BABYLON.Vector3 } ): void;

    get( index: string ): IObjectContainer | null;

    move( node: BABYLON.TransformNode ): void;

    remove( node: BABYLON.TransformNode ): void;

    update(): void;

    debug(): void;
    
}