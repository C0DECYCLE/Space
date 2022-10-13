"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudMaterial extends BABYLON.CustomMaterial {

    #clouds = null;
    
    constructor( clouds ) {
    
        super( `cloud_material`, clouds.scene );

        this.#clouds = clouds;

        this.#setupColor();
        this.#setupTransparency();
        this.#setupAttributes();
        this.#hookShader();
    }

    #setupColor() {

        const diffuse = this.#clouds.config.color;
        
        this.setColorIntensity( diffuse, 1.0 );

        BABYLON.Color3.LerpToRef( this.emissiveColor, BABYLON.Color3.FromHexString( diffuse ), 0.5, this.emissiveColor );
        this.ambientColor.scaleToRef( 1.5, this.ambientColor );
    }

    #setupTransparency() {

        this.alpha = 0.99;
        this.needDepthPrePass = true;
    }

    #setupAttributes() {

        this.AddAttribute( "randomValue" );
        this.AddAttribute( "cloudPosition" );
        this.AddAttribute( "starLightDirection" );
    }

    #hookShader() {
        
        //this.Vertex_Begin( this.#getVertex_Begin() );
        this.Vertex_Definitions( this.#getVertex_Definitions() );
        //this.Vertex_MainBegin( this.#getVertex_MainBegin() );
        this.Vertex_Before_PositionUpdated( this.#getVertex_Before_PositionUpdated() );
        //this.Vertex_After_WorldPosComputed( this.#getVertex_After_WorldPosComputed() );
        //this.Vertex_Before_NormalUpdated( this.#getVertex_Before_NormalUpdated() );
        //this.Vertex_MainEnd( this.#getVertex_MainEnd() );

        //this.Fragment_Begin( this.#getFragment_Begin() );
        this.Fragment_Definitions( this.#getFragment_Definitions() );
        //this.Fragment_MainBegin( this.#getFragment_MainBegin() ); 
        this.Fragment_Custom_Diffuse( this.#getFragment_Custom_Diffuse() );
        //this.Fragment_Custom_Alpha( this.#getFragment_Custom_Alpha() );
        //this.Fragment_Before_Lights( this.#getFragment_Before_Lights() );
        //this.Fragment_Before_Fog( this.#getFragment_Before_Fog() );
        this.Fragment_Before_FragColor( this.#getFragment_Before_FragColor() );
        //this.Fragment_MainEnd( this.#getFragment_MainEnd() ); 
    }

    #getVertex_Definitions() { return `

        ${ EngineUtilsShader.code }

        attribute float randomValue;

        attribute vec3 cloudPosition;
        attribute vec3 starLightDirection;

        flat out float planetOcclusion;
        float cloudLightBlur = 0.5;
        float cloudLightDark = 0.05;

    `; }

    #getVertex_Before_PositionUpdated() { return `
        
        positionUpdated *= 1.0 + ( noise( (position + randomValue) * 2.0 ) - 0.5 ) * 0.75;

        float cloudLightDot = dot( normalize( cloudPosition ), starLightDirection ) * -1.0;
        planetOcclusion = 1.0;
        if ( cloudLightDot < cloudLightBlur ) {
            planetOcclusion = cloudLightDark;
            if ( cloudLightDot > -cloudLightBlur ) {
                planetOcclusion = cloudLightDark + (1.0 - cloudLightDark) * ((cloudLightDot + cloudLightBlur) / (cloudLightBlur * 2.0));
            }
        }

    `; }

    #getFragment_Definitions() { return `

        flat in float planetOcclusion;
        
    `; }

    #getFragment_Custom_Diffuse() { return `

        diffuseColor *= planetOcclusion;
        
    `; }

    #getFragment_Before_FragColor() { return `

        color.rgb -= emissiveColor * (1.0 - planetOcclusion) * 0.65;
        color.rgb *= 0.05 + planetOcclusion;
        color.a *= 0.75 + planetOcclusion * 0.25;
        
    `; }

}