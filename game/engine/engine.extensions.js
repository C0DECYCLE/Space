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

        this.#extend( "StandardMaterial", "setColorIntensity", this.#standardMaterialColorIntensity );
    }

    #extend( parent, name, method ) {

        if ( typeof BABYLON[ parent ].prototype[ name ] != "undefined" ) {

            console.warn( "EngineExtensions: Method " + name + " already exists in " + parent + "." );
 
            return;
        }

        BABYLON[ parent ].prototype[ name ] = method;
    }

    #lightColor( color ) {

        this.diffuse = new BABYLON.Color3.FromHexString( color );
        this.specular = new BABYLON.Color3( 0, 0, 0 );
        this.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        this.ambientColor = new BABYLON.Color3( 0, 0, 0 );
    }

    #lightIntensity( intensity = 1.0 ) {

        this.intensity = intensity;

        let _ambient = this.getScene().ambient;

        if ( typeof _ambient != "undefined" ) {

            this.intensity *= _ambient.lightFactor();
        }
    }

    #standardMaterialColorIntensity( color, intensity = 1.0 ) {
        
        this.diffuseColor = new BABYLON.Color3.FromHexString( color ).scale( intensity );
        this.specularColor = new BABYLON.Color3( 0, 0, 0 );
        this.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        this.ambientColor = new BABYLON.Color3( 0, 0, 0 );

        let _ambient = this.getScene().ambient;

        if ( typeof _ambient != "undefined" ) {

            this.diffuseColor.scale( _ambient.intensity );
            this.ambientColor = new BABYLON.Color3.FromHexString( _ambient.color ).scale( _ambient.materialFactor() );
        }
    }

}