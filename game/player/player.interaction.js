"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerInteraction {

    static RADIUS = 8;
    static EDGE = 6;
    static COLOR = "#3c9dff";

    list = [];

    #player = null;

    constructor( player ) {
        
        this.#player = player;
    }

    register( mesh, event ) {
        
        mesh.edgesWidth = PlayerInteraction.EDGE;
        mesh.edgesColor = BABYLON.Color4.FromHexString( PlayerInteraction.COLOR );

        this.list.push( { mesh: mesh, highlight: false, event: event } );
    }

    update() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.#evaluateInteraction( this.list[i] );
        }
    }

    #evaluateInteraction( interaction ) {

        const distance = EngineUtils.getWorldPosition( interaction.mesh ).subtractInPlace( this.#player.position ).length();

        if ( distance <= PlayerInteraction.RADIUS ) {

            if ( interaction.highlight === false ) {

                interaction.mesh.enableEdgesRendering();
                interaction.highlight = true;
            }

            if ( this.#player.controls.activeKeys.has( "f" ) === true ) {

                interaction.event();
            }

        } else {

            if ( interaction.highlight === true ) {

                interaction.mesh.disableEdgesRendering();
                interaction.highlight = false;
            }
        }
    }

}