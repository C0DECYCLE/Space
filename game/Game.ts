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

    public constructor() {

        const ready: Event = new Event( "ready" );

        window.addEventListener( "compile", ( _event: Event ): void => {

            console.log( `\n\n${ document.title }\n\nPalto Studio\nCopyright Noah Bussinger ${ new Date().getUTCFullYear() }\n\n` );

            this.engine = new Engine();

            window.dispatchEvent( ready );
        } );
    }
    
    public addOnReady( callback: () => void ): void {

        window.addEventListener( "ready", (): void => callback() );
    }

    public add( key: string, callback: () => void ): void {

        switch( key ) {

            case "install": this.install = (): void => callback(); break;
            case "stage": this.stage = (): void => callback(); break;
            case "run": this.run = (): void => callback(); break;
        }
    }

    public update( scene: BABYLON.Scene, update: () => void ): void {

        this.engine.set( ( _delta: number ): void => {
        
            this.engine.stats[3].begin();

            update();

            this.engine.stats[3].end();
    
            scene.render();
        } );
    }
}