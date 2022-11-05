/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetSurface extends IConfigurable {

    readonly list: IPlanetSurfaceObsticle[];

    update( distance: number ): void;

}