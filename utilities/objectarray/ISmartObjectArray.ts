/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ISmartObjectArray< T extends object > extends IObjectArray< T > {

    get size(): number;

    push( ...elements: T[] ): number;

    pop(): T | undefined;

    clear(): void;

    delete( element: T ): void;

}