"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class UI {

    static DEFAULTCOLOR = "#4a9cff";

    config = {

    };

    game = null;

    gui = null;
    markers = [];

    constructor( game, config ) {

        this.game = game;

        EngineUtils.configure.call( this, config );

        this.#setupFullscreenUI();
    }

    createMarker( type, node, size = 32, color = UI.DEFAULTCOLOR ) {

        const marker = new BABYLON.GUI.Rectangle();
        marker.width = `${ size }px`;
        marker.height = marker.width;
        marker.color = color;
        marker.thickness = 5;
        marker.rotation = Math.PI / 4;
        marker.background = "transparent";
        marker.clipContent = false;

        const dot = new BABYLON.GUI.Rectangle();
        dot.width = `${ marker.thickness * 2 }px`;
        dot.height = dot.width;
        dot.thickness = 0;
        dot.color = color;
        dot.background = color;

        const text = new BABYLON.GUI.TextBlock();
        text.rotation = -Math.PI / 4;
        text.text = "";
        text.top = size * 0.85;
        text.left = text.top;
        text.color = color;
        text.clipContent = false;
        text.fontFamily = "ExtraBold";
        text.fontSize = 20;

        marker.addControl( dot );
        marker.addControl( text );
        this.gui.addControl( marker );
        marker.linkWithMesh( node ); 
        this.markers.push( [ type, node, marker, text ] );
    }

    toggleMarkers( type, visible ) {

        for ( let i = 0; i < this.markers.length; i++ ) {

            if ( this.markers[i][0] === type ) {

                this.markers[i][2].isVisible = visible;
            }
        }
    }

    update() {

        this.#updateMarkers();
    }

    #setupFullscreenUI() {

        this.gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI( "ui" );
        this.gui.useInvalidateRectOptimization = false;
    }

    #updateMarkers() {

        for ( let i = 0; i < this.markers.length; i++ ) {

            this.markers[i][3].text = EngineUtils.getWorldPosition( this.markers[i][1] ).subtractInPlace( this.game.player.position ).length().dotit();
        }
    }

}