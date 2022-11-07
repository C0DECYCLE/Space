/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlayerPhysics extends IPhysicsEntity {

    readonly player: IPlayer;

    planet: IPlanet | null;
    
    spaceship: IAbstractSpaceship | null;

}