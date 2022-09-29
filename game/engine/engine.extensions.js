"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EngineExtensions {

    #engine = null;

    constructor( engine ) {

        this.#engine = engine;

        this.#register();
    }

    #register() {

        this.#extend( "DirectionalLight", "setColor", this.#lightColor );
        this.#extend( "DirectionalLight", "setIntensity", this.#lightIntensity );
        
        this.#extend( "PointLight", "setColor", this.#lightColor );
        this.#extend( "PointLight", "setIntensity", this.#lightIntensity );

        this.#extend( "HemisphericLight", "setColor", this.#lightColor );
        this.#extend( "HemisphericLight", "setIntensity", this.#lightIntensity );

        this.#extend( "StandardMaterial", "setColorIntensity", this.#standardMaterialColorIntensity );
    }

    #extend( parent, name, method ) {

        if ( typeof BABYLON[ parent ].prototype[ name ] !== "undefined" ) {

            console.warn( "EngineExtensions: Method " + name + " already exists in " + parent + "." );
 
            return;
        }

        BABYLON[ parent ].prototype[ name ] = method;
    }

    #lightColor( color ) {

        this.diffuse = BABYLON.Color3.FromHexString( color );
        this.specular = new BABYLON.Color3( 0, 0, 0 );
        this.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        this.ambientColor = new BABYLON.Color3( 0, 0, 0 );
    }

    #lightIntensity( intensity = 1.0 ) {

        this.intensity = intensity;

        const ambient = this.getScene().ambient;

        if ( typeof ambient !== "undefined" ) {

            this.intensity *= ambient.lightFactor();
        }
    }

    #standardMaterialColorIntensity( color, intensity = 1.0 ) {
        
        BABYLON.Color3.FromHexString( color ).scaleToRef( intensity, this.diffuseColor );
        this.specularColor = new BABYLON.Color3( 0, 0, 0 );
        this.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        this.ambientColor = new BABYLON.Color3( 0, 0, 0 );

        const ambient = this.getScene().ambient;

        if ( typeof ambient !== "undefined" ) {

            this.diffuseColor.scaleToRef( ambient.intensity, this.diffuseColor );
            BABYLON.Color3.FromHexString( ambient.color ).scaleToRef( ambient.materialFactor(), this.ambientColor );
        }
    }

}