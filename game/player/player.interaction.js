"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerInteraction {

    static RADIUS = 8;
    static EDGE = 8;

    list = [];
    
    #player = null;
    #isInteracting = false;

    constructor( player ) {
        
        this.#player = player;
    }

    get isInteracting() {

        return this.#isInteracting == false ? false : true;
    }

    register( mesh, event, leaveEvent = false ) {
        
        mesh.edgesWidth = PlayerInteraction.EDGE;
        mesh.edgesColor = BABYLON.Color4.FromHexString( UI.NEUTRAL );

        this.#player.game.ui.registerMarker( mesh, { type: "interactable" } );

        this.list.push( { mesh: mesh, highlight: false, event: event, leaveEvent: leaveEvent } );
    }

    unhighlightAll() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.#unhighlight( this.list[i] );
        }
    }

    update() {

        if ( this.isInteracting === true ) {

            this.#interactingUpdate();

        } else {

            this.#defaultUpdate();
        }
    }

    #interactingUpdate() {

        if ( this.#player.controls.activeKeys.has( Controls.KEYS.exit ) === true ) {

            this.#isInteracting();
            this.#isInteracting = false;
        }
    }

    #defaultUpdate() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.#evaluateInteraction( this.list[i] );
        }
    }

    #evaluateInteraction( interaction ) {

        const distance = this.#player.camera.getApproximateScreenDistance( interaction.mesh );

        if ( distance <= PlayerInteraction.RADIUS ) {

            this.#highlight( interaction );

            if ( this.#player.controls.activeKeys.has( Controls.KEYS.interact ) === true ) {

                interaction.event();
                this.#isInteracting = interaction.leaveEvent;

                if ( this.isInteracting === true ) {

                    this.unhighlightAll();
                }
            }

        } else {

            this.#unhighlight( interaction );
        }
    }

    #highlight( interaction ) {

        if ( interaction.highlight === false ) {

            //interaction.mesh.enableEdgesRendering();
            interaction.highlight = true;
        }
    }

    #unhighlight( interaction ) {

        if ( interaction.highlight === true ) {
                
            //interaction.mesh.disableEdgesRendering();
            interaction.highlight = false;
        }
    }

}