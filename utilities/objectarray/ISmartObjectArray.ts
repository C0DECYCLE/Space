/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ISmartObjectArray {

    get size(): number;

    push( ...elements: object[] ): number;

    pop(): object | undefined;

    clear(): void;

    delete( element: object ): void;

}