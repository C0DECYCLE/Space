/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IEntitySpawnerPlanet extends IConfigurable {

    readonly planet: IPlanet;

    readonly list: ISpawnable[];
}