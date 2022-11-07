/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ISpaceshipThrusters {

    readonly spaceship: IAbstractSpaceship;

    readonly list: [ BABYLON.GPUParticleSystem, IConfig ][];

    update(): void;

}