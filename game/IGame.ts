/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IGame {

    engine: IEngine;

    install: () => void;

    stage: () => void;
    
    run: () => void;
    
    addOnReady( callback: () => void ): void;

    add( key: string, callback: () => void ): void;

    update( scene: BABYLON.Scene, update: ( delta: number ) => void ): void;

}