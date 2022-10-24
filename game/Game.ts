/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Game implements IGame {

    public engine: IEngine;
    public scene: BABYLON.Scene;

    public install: () => void = () => {};
    public stage: () => void = () => {};
    public run: () => void = () => {};

    public constructor() {

        const ready: Event = new Event( "ready" );

        window.addEventListener( "load", ( _event: Event ) => {

            console.log( `\n\n${ document.title }\n\nPalto Studio\nCopyright Noah Bussinger ${ new Date().getUTCFullYear() }\n\n` );

            this.engine = new Engine();

            window.dispatchEvent( ready );
        } );
    }
    
    public addOnReady( callback: () => void ): void {

        window.addEventListener( "ready", () => callback.call( this ) );
    }

    public add( key: string, callback: () => void ): void {

        switch( key ) {

            case "install": this.install = () => callback.call( this ); break;
            case "stage": this.stage = () => callback.call( this ); break;
            case "run": this.run = () => callback.call( this ); break;
        }
    }

    public update( scene: BABYLON.Scene, update: ( delta: number ) => void ): void {

        this.engine.set( ( delta: number ) => {
        
            this.engine.stats[3].begin();

            update( delta );

            this.engine.stats[3].end();
    
            scene.render();
        } );
    }
}