/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ISpaceships {

    readonly game: IGame;

    readonly scene: BABYLON.Scene;

    readonly variants: Map< string, Spaceship >;

    readonly list: ISpaceship[];

    register( variant: string, config: IConfig ): void;

    update(): void;
    
    planetInsert( planet: IPlanet, distance: number, planetThreashold: number ): void;
    
}