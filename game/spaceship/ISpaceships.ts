/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ISpaceships extends IConfigurable, ISingleton {

    readonly list: IAbstractSpaceship[];

    register( variant: string, config: IConfig ): void;

    update(): void;
    
    planetInsert( planet: IPlanet, distance: number, planetThreashold: number ): void;
    
}