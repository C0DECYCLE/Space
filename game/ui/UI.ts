/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class UI implements IUI {

    public static readonly NEUTRAL: string = "#4a9cff";
    public static readonly BAD: string = "#ff255b";
    public static readonly LIGHTUP: string = "#ffdb6f";

    public config: IConfig = new Config(  

    );

    public readonly game: IGame;

    public gui: BABYLON.GUI.AdvancedDynamicTexture;
    public readonly markers: Map< string, IUIMarker[] > = new Map< string, IUIMarker[] >();

    public constructor( game: IGame, config: IConfig ) {

        this.game = game;

        EngineUtils.configure( this, config );

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

        this.gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI( "ui", true, this.game.scene );
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