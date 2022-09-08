"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class UI {

    static NEUTRAL = "#4a9cff";
    static BAD = "#ff255b";
    static LIGHTUP = "#ffdb6f";

    config = {

    };

    game = null;

    gui = null;
    markers = new Map();

    constructor( game, config ) {

        this.game = game;

        EngineUtils.configure.call( this, config );

        this.#setupFullscreenUI();
        this.#setupMarkers();
    }

    registerMarker( node, config ) {

        this.markers.get( config.type ).push( new UIMarker( this, node, config ) );
    }

    update() {

        this.#updateMarkers();
    }

    #setupFullscreenUI() {

        this.gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI( "ui", true, this.game.scene );
        this.gui.useInvalidateRectOptimization = false;
    }

    #setupMarkers() {

        this.markers.set( "travel", [] );
        this.markers.set( "interactable", [] );
        this.markers.set( "hint", [] );
    }

    #updateMarkers() {

        this.markers.forEach( ( list, type ) => {

            for ( let i = 0; i < list.length; i++ ) {

                list[i].update();
            }
        } );
    }

}