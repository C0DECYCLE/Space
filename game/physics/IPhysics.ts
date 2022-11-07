/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPhysics extends IConfigurable, ISingleton {

    get isPaused(): boolean;

    pause(): void;

    resume(): void;
}