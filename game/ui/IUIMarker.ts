/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IUIMarker extends IConfigurable {
    
    readonly ui: IUI;

    readonly transformNode: BABYLON.TransformNode;

    readonly lightUp: boolean;

    get visible(): boolean;

    set visible( value );

    get direction(): BABYLON.Vector3;

    get distance(): number;

    get isNear(): boolean;

    update(): void;

}