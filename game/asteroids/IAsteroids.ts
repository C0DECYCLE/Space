/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IAsteroids extends IConfigurable {

    readonly game: IGame;
    
    readonly scene: BABYLON.Scene;

    readonly variants: Map< string, IModels >;

    readonly list: IAsteroidsDistributer[];

    register( type: string, config: IConfig ): void;

    update(): void;

}