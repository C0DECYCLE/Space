/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IObjectArray {

    push( ...elements: object[] ): number;

    indexOf( element: object, fromIndex?: number | undefined ): number;

    pop(): object | undefined;

    splice( start: number, deleteCount?: number | undefined ): object[];

    splice( start: number, _deleteCount: number, ..._items: object[] ): object[];

    shift(): object | undefined;

    sort( _compareFn?: ( ( a: object, b: object ) => number) | undefined ): this;

    unshift( ..._items: object[] ): number;

    clear(): void;
    
    add( element: object ): void;

    includes( element: object ): boolean;

    has( element: object ): boolean;

    delete( element: object, length: number ): void;

}