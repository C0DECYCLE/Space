"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EngineAmbient {
    
    scene = null;

    color = undefined;
    intensity = undefined;

    constructor( scene, color, intensity ) {
        
        this.scene = scene;

        this.color = color;
        this.intensity = intensity;

        if ( typeof this.scene.ambient !== "undefined" ) {

            console.warn( "Ambient: Already exists for this scene." );

            return;
        }

        this.scene.ambientColor = new BABYLON.Color3( 1, 1, 1 );
    }
    
    lightFactor() {

        return ( 1 / this.materialFactor() );
    }
    
    materialFactor() {

        return ( this.intensity * 0.5 );
    }

}