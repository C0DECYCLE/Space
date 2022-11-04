/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ISpaceshipPhysicsTravel {

    readonly game: IGame;

    readonly spaceshipPhysics: ISpaceshipPhysics;

    get isTraveling(): boolean;

    get isJumping(): boolean;

    update(): void;

}