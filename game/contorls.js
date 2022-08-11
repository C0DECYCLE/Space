"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Controls {

    config = {

        panning: 0.005,

        experimentalPointerLock: true
    };

    manager = null;
    scene = null;

    isKeyboarding = false;
    activeKeys = new Set();

    isPointerDown = false;
    onPointerDown = new Set();
    onPointerUp = new Set();
    onPointerMove = new Set();

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        this.config.panning = config.panning || this.config.panning;

        this.#bindKeyboard();
        this.#bindMouse();
    }

    #bindKeyboard() {

        this.scene.onKeyboardObservable.add( kbInfo => {
            
            if ( kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN ) {
                
                this.activeKeys.add( kbInfo.event.key.toLowerCase() );

            } else if ( kbInfo.type == BABYLON.KeyboardEventTypes.KEYUP ) {

                this.activeKeys.delete( kbInfo.event.key.toLowerCase() );
            }

            this.isKeyboarding = this.activeKeys.size > 0;
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

            } else if ( pointerInfo.type == BABYLON.PointerEventTypes.POINTERMOVE && this.config.experimentalPointerLock == false ) {

                this.onPointerMove.forEach( callback => callback( pointerInfo ) );
            }
        } );

        if ( this.config.experimentalPointerLock == true ) {

            this.#pointerLock();
        }
    }

    #pointerLock() {

        let canvas = Space.engine.babylon._renderingCanvas;
        let mouseMove = ( event ) => this.onPointerMove.forEach( callback => callback( { event: event } ) );
        let changeCallback = ( e ) => {

            if (document.pointerLockElement === canvas ||
                document.mozPointerLockElement === canvas ||
                document.webkitPointerLockElement === canvas
            ){

                document.addEventListener( "mousemove", mouseMove, false );

            } else {
                
                document.removeEventListener( "mousemove", mouseMove, false );
            }
        };

        document.addEventListener('pointerlockchange', changeCallback, false);
        document.addEventListener('mozpointerlockchange', changeCallback, false);
        document.addEventListener('webkitpointerlockchange', changeCallback, false);

        canvas.onclick = () => {

            canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            canvas.requestPointerLock();
        };
    }

}