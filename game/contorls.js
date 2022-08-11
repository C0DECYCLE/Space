"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Controls {

    config = {

        panning: 0.005
    };

    scene = null;

    isKeyboarding = false;
    activeKeys = new Set();

    isPointerDown = false;
    onPointerDown = new Set();
    onPointerUp = new Set();
    onPointerMove = new Set();

    constructor( scene, config ) {

        this.scene = scene;

        this.#bindKeyboard();
        this.#bindMouse();
    }

    #bindKeyboard() {

        this.scene.onKeyboardObservable.add( kbInfo => {
            
            if ( kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN ) {
                
                this.isKeyboarding = true;
                this.activeKeys.add( kbInfo.event.key.toLowerCase() );

            } else if ( kbInfo.type == BABYLON.KeyboardEventTypes.KEYUP ) {

                this.isKeyboarding = false;
                this.activeKeys.delete( kbInfo.event.key.toLowerCase() );
            }
        } );
    }

    #bindMouse() {

        this.scene.onPointerObservable.add( pointerInfo => {
            
            if ( pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN ) {

                this.isPointerDown = true;
                this.onPointerDown.forEach( callback => callback( pointerInfo ) );

            } else if ( pointerInfo.type == BABYLON.PointerEventTypes.POINTERUP ) {

                this.isPointerDown = false;
                this.onPointerUp.forEach( callback => callback( pointerInfo ) );

            } else if ( pointerInfo.type == BABYLON.PointerEventTypes.POINTERMOVE ) {

                this.onPointerMove.forEach( callback => callback( pointerInfo ) );
            }
        } );
    }

}