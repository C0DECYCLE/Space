/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlayerPhysics extends IPhysicsEntity {

    readonly player: IPlayer;

    readonly controls: IControls;

    planet: IPlanet | null;
    
    spaceship: ISpaceship | null;

}