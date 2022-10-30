/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPhysics extends IConfigurable {

    readonly game: IGame;
    
    readonly scene: BABYLON.Scene;

    get isPaused(): boolean;

    pause(): void;

    resume(): void;
}