/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Engine implements IEngine {
    
    public canvas: HTMLCanvasElement;
    public babylon: BABYLON.Engine;
    public screenSize: BABYLON.Vector2;
    public readonly stats: Stats[] = [];

    public get deltaCorrection(): number {

        return this.deltaCorrectionValue;
    }

    private readonly fpsTarget: number = 60;
    private deltaCorrectionValue: number = 1.0;
    private update: ( delta: number ) => void = ( _delta: number ): void => {};

    public constructor() {
    
        this.createCanvas();
        this.browserSupport( (): void => {

            this.createBabylon();
            this.createStats();

            this.babylon.runRenderLoop( (): void => this.render() );
            window.addEventListener( "resize", (): void => this.babylon.resize() );
        } );
    }

    public set( update: ( delta: number ) => void ): void {

        this.update = update;
    }
    
    private createCanvas(): void {

        this.canvas = document.createElement( "canvas" );        
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";

        document.body.appendChild( this.canvas );
    }

    private browserSupport( callback: () => void ): void {
        
        const context: WebGL2RenderingContext | null = this.canvas.getContext( "webgl2" );
        
        if ( context !== null && context instanceof WebGL2RenderingContext ) {

            callback();
            return;
        }
            
        console.error( "No WebGL2 support!" );
    }

    private createBabylon(): void {

        this.babylon = new BABYLON.Engine( this.canvas );
        this.screenSize = new BABYLON.Vector2( this.babylon.getRenderWidth(), this.babylon.getRenderHeight() );
    }

    private createStats(): void {

        this.stats.push( this.createStat( 0 ) ); // fps
        this.stats.push( this.createStat( 1 ) ); // ms
        this.stats.push( this.createStat( 2 ) ); // mb
        this.stats.push( this.createStat( 1 ) ); // custom
    }

    private createStat( i: number ): Stats { // 0: fps, 1: ms, 2: mb, 3+: custom

        const stat: Stats = new Stats();
        stat.showPanel( i );
        stat.dom.style.cssText = `position:absolute;top:0px;left:${ this.stats.length * 80 }px;`;
        document.body.appendChild( stat.dom );

        return stat;
    }

    private render(): void {

        for ( let i: number = 0; i < 3; i++ ) {

            this.stats[i].begin();
        }
        
        const deltaTime: number = this.babylon.getDeltaTime();
        this.deltaCorrectionValue = EngineUtils.getDeltaCorrection( deltaTime, this.fpsTarget );
        this.update( deltaTime );
        
        for ( let i: number = 0; i < 3; i++ ) {

            this.stats[i].end();
        }
    }
    
}