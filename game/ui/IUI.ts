/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IUI extends IConfigurable {

    readonly game: IGame;

    gui: BABYLON.GUI.AdvancedDynamicTexture;

    readonly markers: Map< string, IUIMarker[] >;

    registerMarker( transformNode: BABYLON.TransformNode, config: IConfig ): void;

    update(): void;
}