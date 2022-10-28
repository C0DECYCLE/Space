/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IObjectArray< T extends object > {

    push( ...elements: T[] ): number;

    indexOf( element: T, fromIndex?: number ): number;

    includes( element: T, _fromIndex?: number ): boolean;

    pop(): T | undefined;

    splice( start: number, deleteCount?: number ): T[];

    splice( start: number, _deleteCount: number, ..._items: T[] ): T[];

    shift(): T | undefined;

    sort( _compareFn?: ( ( a: T, b: T ) => number) ): this;

    unshift( ..._items: T[] ): number;

    clear(): void;
    
    add( element: T ): void;

    has( element: T ): boolean;

    delete( element: T, length: number ): void;

}