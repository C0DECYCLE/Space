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

    unhighlightAll() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.#unhighlight( this.list[i] );
        }
    }

    update() {

        if ( this.#player.state.is( "spaceship" ) === true ) {

            this.#spaceshipUpdate();

        } else {

            this.#defaultUpdate();
        }
    }

    #spaceshipUpdate() {

        if ( this.#player.controls.activeKeys.has( "p" ) === true ) {

            this.#player.state.set( "space" );
        }
    }

    #defaultUpdate() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.#evaluateInteraction( this.list[i] );
        }
    }

    #evaluateInteraction( interaction ) {

        const distance = EngineUtils.getWorldPosition( interaction.mesh ).subtractInPlace( this.#player.position ).length();

        if ( distance <= PlayerInteraction.RADIUS ) {

            this.#highlight( interaction );

            if ( this.#player.controls.activeKeys.has( "f" ) === true ) {

                interaction.event();
            }

        } else {

            this.#unhighlight( interaction );
        }
    }

    #highlight( interaction ) {

        if ( interaction.highlight === false ) {

            interaction.mesh.enableEdgesRendering();
            interaction.highlight = true;
        }
    }

    #unhighlight( interaction ) {

        if ( interaction.highlight === true ) {
                
            interaction.mesh.disableEdgesRendering();
            interaction.highlight = false;
        }
    }

}