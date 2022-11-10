/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IControls extends IConfigurable, ISingleton {

    readonly activeKeys: Set< string >;

    readonly onPointerDown: Set< TPointerEvent >;

    readonly onPointerUp: Set< TPointerEvent >;
    
    readonly onPointerMove: Set< TPointerEvent >;

    get isKeyboarding(): boolean;

    get isPointerDown(): boolean;

}