/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Game implements IGame {

    public engine: IEngine;
    public scene: BABYLON.Scene;

    public install: () => void = (): void => {};
    public stage: () => void = (): void => {};
    public run: () => void = (): void => {};

    public objectcontainers: IObjectContainers;
    public physics: IPhysics;
    public controls: IControls;
    public camera: ICamera;
    public postprocess: IPostProcess;
    public ui: IUI;
    public star: IStar;
    public player: IPlayer;
    public spaceships: ISpaceships;
    public clouds: IClouds;
    public planets: IPlanets;
    public asteroids: IAsteroids;

    public constructor() {

        const ready: Event = new Event( "ready" );

        window.addEventListener( "load", ( _event: Event ): void => {

            console.log( `\n\n${ document.title }\n\nPalto Studio\nCopyright Noah Bussinger ${ new Date().getUTCFullYear() }\n\n` );

            public engine = new Engine();

            window.dispatchEvent( ready );
        } );
    }
    
    public addOnReady( callback: () => void ): void {

        window.addEventListener( "ready", (): void => callback.call( this ) );
    }

    public add( key: string, callback: () => void ): void {

        switch( key ) {

            case "install": public install = (): void => callback.call( this ); break;
            case "stage": public stage = (): void => callback.call( this ); break;
            case "run": public run = (): void => callback.call( this ); break;
        }
    }

    public update( scene: BABYLON.Scene, update: ( delta: number ) => void ): void {

        public engine.set( ( delta: number ): void => {
        
            public engine.stats[3].begin();

            update( delta );

            public engine.stats[3].end();
    
            scene.render();
        } );
    }
}