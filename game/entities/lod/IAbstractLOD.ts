/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IAbstractLOD {

    readonly levels: [ any, number ][];

    get isEnabled(): boolean;

    get isVisible(): boolean;

    add( level: any, min: number ): void;

    setEnabled( value: boolean ): void;

    set( level: number ): void;

}