/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class UI implements IUI {

    /* Singleton */ 
    private static instance: IUI; 
    public static instantiate(): void { if ( this.instance === undefined ) this.instance = new UI(); } 
    public static getInstance(): IUI { return this.instance; }
    
    public static readonly NEUTRAL: string = "#4a9cff";
    public static readonly BAD: string = "#ff255b";
    public static readonly LIGHTUP: string = "#ffdb6f";

    public config: IConfig = new Config(  

    );

    public gui: BABYLON.GUI.AdvancedDynamicTexture;
    public readonly markers: Map< string, IUIMarker[] > = new Map< string, IUIMarker[] >();

    private constructor() {

        this.setupFullscreenUI();
        this.setupMarkers();
    }

    public registerMarker( transformNode: BABYLON.TransformNode, config: IConfig ): void {

        this.markers.get( config.type )?.push( new UIMarker( this, transformNode, config ) );
    }

    public update(): void {

        this.updateMarkers();
    }

    private setupFullscreenUI(): void {

        this.gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI( "ui", true, scene );
        this.gui.useInvalidateRectOptimization = false;
    }

    private setupMarkers(): void {

        this.markers.set( "travel", [] );
        this.markers.set( "interactable", [] );
        this.markers.set( "hint", [] );
    }

    private updateMarkers(): void {

        this.markers.forEach( ( list: IUIMarker[], _type: string ): void => {

            for ( let i: number = 0; i < list.length; i++ ) {

                list[i].update();
            }
        } );
    }

}