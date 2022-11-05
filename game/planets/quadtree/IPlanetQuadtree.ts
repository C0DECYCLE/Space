/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetQuadtree {

    readonly planet: IPlanet;

    readonly suffix: string;

    insert( params: IPlanetInsertParameters ): void;

}