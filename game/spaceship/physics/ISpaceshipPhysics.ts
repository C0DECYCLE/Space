/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ISpaceshipPhysics extends IPhysicsEntity {

    readonly spaceship: ISpaceship;

    readonly controls: IControls;

    travel: ISpaceshipPhysicsTravel;

    get thrust(): number;

    update(): void;

}