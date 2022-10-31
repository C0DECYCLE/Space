/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IGame {

    engine: IEngine;
    
    scene: BABYLON.Scene;

    install: () => void;

    stage: () => void;
    
    run: () => void;

    objectcontainers: IObjectContainers;

    physics: IPhysics;

    controls: IControls;

    camera: ICamera;

    postprocess: IPostProcess;

    ui: IUI;

    star: IStar;

    player: IPlayer;

    spaceships: ISpaceships;

    clouds: IClouds;

    planets: IPlanets;
    
    asteroids: IAsteroids;
    
    addOnReady( callback: () => void ): void;

    add( key: string, callback: () => void ): void;

    update( scene: BABYLON.Scene, update: () => void ): void;

}