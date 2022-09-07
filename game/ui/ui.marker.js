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
        thickness: 5,
        fontFamily: "ExtraBold",
        fontSize: 20
    };
    
    node = null;
    
    #ui = null;

    #outer = null;
    #inner = null;
    #text = null;

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

    update() {

        const distance = EngineUtils.getWorldPosition( this.node ).subtractInPlace( this.#ui.game.player.position ).length();
        const size = EngineUtils.getBounding( this.node ).size;

        if ( this.config.type === "travel" ) {

            this.visible = this.#ui.game.player.physics.spaceship !== null; //&& this.#ui.game.player.physics.spaceship.isTraveling;

        } else if ( this.config.type === "interactable" ) {

            this.visible = distance < size * 4 && this.#ui.game.player.interaction.isInteracting === false;

        } else if ( this.config.type === "hint" ) {

            this.visible = distance > size * 2;
        }

        if ( this.visible === true ) {

            this.#text.text = distance.dotit();

            if ( this.config.type === "travel" ) {

                this.#outer.color = distance < size / 2 ? UI.BAD : this.config.color;
                this.#inner.color = this.#outer.color;
                this.#inner.background = this.#outer.color;
                this.#text.color = this.#outer.color;
            }
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

}