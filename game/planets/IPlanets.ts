/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanets extends IConfigurable {

    readonly game: IGame;

    readonly scene: BABYLON.Scene;

    readonly camera: ICamera;

    readonly player: IPlayer;

    readonly spaceships: ISpaceships;

    readonly list: IPlanet[];

    readonly obsticles: Map< string, Map< string, IModels > >;

    readonly obsticleKeys: IConfig;

    register( config: IConfig ): void;

    registerFromConfigs( configs: IConfig[] ): void;

    getMaskMaterial(): BABYLON.StandardMaterial;

    update(): void;

}