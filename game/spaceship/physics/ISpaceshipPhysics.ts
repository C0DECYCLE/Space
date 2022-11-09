/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ISpaceshipPhysics extends IPhysicsEntity {

    readonly spaceship: IAbstractSpaceship;

    travel: ISpaceshipPhysicsTravel;

    get thrust(): float;

    update(): void;

}