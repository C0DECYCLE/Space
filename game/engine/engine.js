"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Engine {
    
    canvas = null;
    babylon = null;
    extensions = null;

    stats = [];

    #update = function() {};

    constructor() {
    
        this.#createCanvas();
        this.#browserSupport( () => {

            this.#createBabylon();
            this.#createExtensions();
            this.#createStats();

            this.babylon.runRenderLoop( () => this.#render() );

            window.addEventListener( "resize", () => this.babylon.resize() );
        } );
    }

    set( update ) {

        if ( typeof update == "function" ) {

            this.#update = update;
        }
    }
    
    #createCanvas() {

        this.canvas = document.createElement( "canvas" );
        
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        
        document.body.appendChild( this.canvas );
    }

    #browserSupport( callback ) {
        
        let context = this.canvas.getContext( "webgl2" );
        
        if ( context && context instanceof WebGL2RenderingContext ) {
            
            context = null;

            callback();

        } else {
            
            console.error( "No WebGL2 support!" );
        }
    }

    #createBabylon() {

        this.babylon = new BABYLON.Engine( this.canvas );
    }

    #createExtensions() {

        this.extensions = new EngineExtensions( this );
    }

    #createStats() {

        this.stats.push( this.#createStat( 0 ) ); // fps
        this.stats.push( this.#createStat( 1 ) ); // ms
        this.stats.push( this.#createStat( 2 ) ); // mb
        this.stats.push( this.#createStat( 3 ) ); // custom
    }

    #createStat( i ) { // 0: fps, 1: ms, 2: mb, 3+: custom

        const stat = new Stats();
        stat.showPanel( i );
        stat.dom.style.cssText = `position:absolute;top:0px;left:${ this.stats.length * 80 }px;`;

        document.body.appendChild( stat.dom );

        return stat;
    }

    #render() {

        this.stats.forEach( ( stat ) => stat.begin() );
        
        this.#update( this.babylon.getDeltaTime() );
            
        if ( TWEEN ) {
            
            TWEEN.update();
        }
        
        this.stats.forEach( ( stat ) => stat.end() );
    }
    
}