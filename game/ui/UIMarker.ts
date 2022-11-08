/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class UIMarker implements IUIMarker {

    public config: IConfig = {
        
        type: "hint",
    
        size: 32,
        color: UI.NEUTRAL,
        lightUpColor: UI.LIGHTUP,
        thickness: 5,
        fontFamily: "ExtraBold",
        fontSize: 20
    };

    public readonly ui: IUI;
    public readonly transformNode: BABYLON.TransformNode;
    public lightUp: boolean = false;

    public get visible(): boolean {

        return this.outer.isVisible;
    }

    public set visible( value ) {

        this.outer.isVisible = value;
    }

    public get direction(): BABYLON.Vector3 {

        return this.directionValue;
    }

    public get distance(): number {

        return this.distanceValue;
    }

    public get isNear(): boolean {

        return this.isNearValue;
    }

    private outer: BABYLON.GUI.Rectangle;
    private inner: BABYLON.GUI.Rectangle;
    private text: BABYLON.GUI.TextBlock;

    private directionValue: BABYLON.Vector3;
    private distanceValue: number;
    private isNearValue: boolean;

    public constructor( ui: IUI, transformNode: BABYLON.TransformNode, config?: IConfig ) {

        this.ui = ui;
        this.transformNode = transformNode;

        EngineUtils.configure( this, config );

        this.create();
    }

    public update(): void {

        this.isNearValue = this.evaluateNear();
        this.visible = this.evaluateVisible();

        if ( this.visible === true ) {

            this.updateVisual();
        }
    }

    private create(): void {

        this.outer = new BABYLON.GUI.Rectangle();
        this.outer.width = `${ this.config.size }px`;
        this.outer.height = this.outer.width;
        this.outer.color = this.config.color;
        this.outer.thickness = this.config.thickness;
        this.outer.rotation = Math.PI / 4;
        this.outer.background = "transparent";
        this.outer.clipContent = false;

        this.inner = new BABYLON.GUI.Rectangle();
        this.inner.width = `${ this.outer.thickness * 2 }px`;
        this.inner.height = this.inner.width;
        this.inner.thickness = 0;
        this.inner.color = this.outer.color;
        this.inner.background = this.outer.color;

        this.text = new BABYLON.GUI.TextBlock();
        this.text.rotation = -Math.PI / 4;
        this.text.text = "";
        this.text.top = this.config.size * 0.85;
        this.text.left = this.text.top;
        this.text.color = this.outer.color;
        this.text.clipContent = false;
        this.text.fontFamily = this.config.fontFamily;
        this.text.fontSize = this.config.fontSize;

        this.outer.addControl( this.inner );
        this.outer.addControl( this.text );
        this.ui.gui.addControl( this.outer );
        this.outer.linkWithMesh( this.transformNode ); 
    }

    private evaluateNear(): boolean {

        const worldPosition: BABYLON.Vector3 = EngineUtils.getWorldPosition( this.transformNode );
        const size: number = EngineUtils.getBoundingSize( this.transformNode );

        this.distanceValue = Camera.getInstance().getScreenDistance( worldPosition );
        this.directionValue = worldPosition.subtractInPlace( Player.getInstance().position ).normalize();

        if ( this.config.type === "travel" ) {

            return this.distance < size / 2;

        } else if ( this.config.type === "interactable" ) {

            return this.distance < size * 4 && this.distance > PlayerInteraction.RADIUS;

        } else if ( this.config.type === "hint" ) {

            return this.distance > size * 2;
        }

        return false;
    }

    private evaluateVisible(): boolean {

        if ( this.config.type === "travel" ) {

            const spaceship = Player.getInstance().physics.spaceship;

            return spaceship?.physics.travel.isTraveling === true && spaceship?.physics.travel.isJumping === false;

        } else if ( this.config.type === "interactable" ) {

            return this.isNear === true && Player.getInstance().interaction.isInteracting === false;

        } else if ( this.config.type === "hint" ) {

            return this.isNear;
        }

        return false;
    }

    private updateVisual(): void {

        this.text.text = this.distance.dotit();

        if ( this.config.type === "travel" ) {

            this.updateColor( this.isNear ? UI.BAD : this.config.color );
        }

        if ( this.lightUp === true ) {
         
            this.updateColor( this.config.lightUpColor  );   
        }
    }

    private updateColor( color: string ): void {

        this.outer.color = color;
        this.inner.color = this.outer.color;
        this.inner.background = this.outer.color;
        this.text.color = this.outer.color;
    }

}