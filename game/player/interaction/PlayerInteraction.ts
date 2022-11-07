/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerInteraction implements IPlayerInteraction {

    public static readonly RADIUS: number = 4;
    public static readonly EDGE: number = 8;
    
    public readonly player: IPlayer;
    public readonly list: IInteraction[] = [];

    public get isInteracting(): boolean {
        
        return this.interactionCarrier == undefined ? false : true;
    }

    private interactionCarrier?: TInteractionEvent;

    public constructor( player: IPlayer ) {
        
        this.player = player;
    }

    public register( mesh: BABYLON.InstancedMesh, event: TInteractionEvent, leaveEvent?: TInteractionEvent ): void {
        
        mesh.edgesWidth = PlayerInteraction.EDGE;
        mesh.edgesColor = BABYLON.Color4.FromHexString( UI.NEUTRAL );

        UI.getInstance().registerMarker( mesh, new Config( [ "type", "interactable" ] ) );

        this.list.push( new Interaction( mesh, event, leaveEvent, false ) );
    }

    public unhighlightAll(): void {

        for ( let i: number = 0; i < this.list.length; i++ ) {

            this.unhighlight( this.list[i] );
        }
    }

    public update(): void {

        if ( this.isInteracting === true ) {

            this.interactingUpdate();

        } else {

            this.defaultUpdate();
        }
    }

    private interactingUpdate(): void {

        if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Exit ) === true ) {

            this.interactionCarrier?.();
            this.interactionCarrier = undefined;
        }
    }

    private defaultUpdate(): void {

        for ( let i: number = 0; i < this.list.length; i++ ) {

            this.evaluateInteraction( this.list[i] );
        }
    }

    private evaluateInteraction( interaction: IInteraction ): void {

        const distance: number = Camera.getInstance().getApproximateScreenDistance( interaction.mesh );

        if ( distance <= PlayerInteraction.RADIUS /*&& view direction pointing towards it*/ ) {

            this.highlight( interaction );

            if ( Controls.getInstance().activeKeys.has( Controls.KEYS.Interact ) === true ) {

                interaction.event();
                this.interactionCarrier = interaction.leaveEvent;

                if ( this.isInteracting === true ) {

                    this.unhighlightAll();
                }
            }

        } else {

            this.unhighlight( interaction );
        }
    }

    private highlight( interaction: IInteraction ): void {

        if ( interaction.highlight === false ) {

            EngineUtilsShader.setInstanceAttribute( interaction.mesh, "interactable", 1 );
            interaction.mesh.enableEdgesRendering(); //?
            interaction.highlight = true;
        }
    }

    private unhighlight( interaction: IInteraction ): void {

        if ( interaction.highlight === true ) {
                
            EngineUtilsShader.setInstanceAttribute( interaction.mesh, "interactable", 0 );
            interaction.mesh.disableEdgesRendering(); //?
            interaction.highlight = false;
        }
    }

}