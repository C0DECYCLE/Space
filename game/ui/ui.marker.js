"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class UIMarker {

    config = {

        type: "hint",

        size: 32,
        color: UI.NEUTRAL,
        lightUpColor: UI.LIGHTUP,
        thickness: 5,
        fontFamily: "ExtraBold",
        fontSize: 20
    };
    
    node = null;
    lightUp = false;
    
    #ui = null;

    #outer = null;
    #inner = null;
    #text = null;

    #direction = undefined;
    #distance = undefined;
    #isNear = undefined;

    constructor( ui, node, config ) {

        this.#ui = ui;

        this.node = node;

        EngineUtils.configure.call( this, config );

        this.#create();
    }

    get visible() {

        return this.#outer.isVisible;
    }

    set visible( value ) {

        this.#outer.isVisible = value;
    }

    get direction() {

        return this.#direction;
    }

    get isNear() {

        return this.#isNear;
    }

    update() {

        this.#isNear = this.#evaluateNear();
        this.visible = this.#evaluateVisible();

        if ( this.visible === true ) {

            this.#updateVisual();
        }
    }

    #create() {

        this.#outer = new BABYLON.GUI.Rectangle();
        this.#outer.width = `${ this.config.size }px`;
        this.#outer.height = this.#outer.width;
        this.#outer.color = this.config.color;
        this.#outer.thickness = this.config.thickness;
        this.#outer.rotation = Math.PI / 4;
        this.#outer.background = "transparent";
        this.#outer.clipContent = false;

        this.#inner = new BABYLON.GUI.Rectangle();
        this.#inner.width = `${ this.#outer.thickness * 2 }px`;
        this.#inner.height = this.#inner.width;
        this.#inner.thickness = 0;
        this.#inner.color = this.#outer.color;
        this.#inner.background = this.#outer.color;

        this.#text = new BABYLON.GUI.TextBlock();
        this.#text.rotation = -Math.PI / 4;
        this.#text.text = "";
        this.#text.top = this.config.size * 0.85;
        this.#text.left = this.#text.top;
        this.#text.color = this.#outer.color;
        this.#text.clipContent = false;
        this.#text.fontFamily = this.config.fontFamily;
        this.#text.fontSize = this.config.fontSize;

        this.#outer.addControl( this.#inner );
        this.#outer.addControl( this.#text );
        this.#ui.gui.addControl( this.#outer );
        this.#outer.linkWithMesh( this.node ); 
    }

    #evaluateNear() {

        const worldPosition = EngineUtils.getWorldPosition( this.node );
        const size = EngineUtils.getBoundingSize( this.node );

        this.#distance = this.#ui.game.camera.getApproximateScreenDistance( this.node, worldPosition );
        this.#direction = worldPosition.subtractInPlace( this.#ui.game.player.position ).normalize();

        if ( this.config.type === "travel" ) {

            return this.#distance < size / 2;

        } else if ( this.config.type === "interactable" ) {

            return this.#distance < size * 4;

        } else if ( this.config.type === "hint" ) {

            return this.#distance > size * 2;
        }
    }

    #evaluateVisible() {

        if ( this.config.type === "travel" ) {

            const spaceship = this.#ui.game.player.physics.spaceship;

            return spaceship?.physics.travel.isTraveling === true && spaceship?.physics.travel.isJumping === false;

        } else if ( this.config.type === "interactable" ) {

            return this.#isNear === true && this.#ui.game.player.interaction.isInteracting === false;

        } else if ( this.config.type === "hint" ) {

            return this.#isNear;
        }
    }

    #updateVisual() {

        this.#text.text = this.#distance.dotit();

        if ( this.config.type === "travel" ) {

            this.#updateColor( this.#isNear ? UI.BAD : this.config.color );
        }

        if ( this.lightUp === true ) {
         
            this.#updateColor( this.config.lightUpColor  );   
        }
    }

    #updateColor( color ) {

        this.#outer.color = color;
        this.#inner.color = this.#outer.color;
        this.#inner.background = this.#outer.color;
        this.#text.color = this.#outer.color;
    }

}