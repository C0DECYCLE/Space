"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerInteractionMaterial extends BABYLON.CustomMaterial {

    #game = null;
    
    constructor( game ) {
    
        super( `player_interaction_material`, game.scene );

        this.#game = game;

        this.#setupColors();
        this.#setupUniforms();
        this.#hookShader();
    }

    #setupColors() {
        
    }

    #setupUniforms() {

    }

    #hookShader() {
        
        //this.Vertex_Begin( this.#getVertex_Begin() );
        this.Vertex_Definitions( this.#getVertex_Definitions() );
        //this.Vertex_MainBegin( this.#getVertex_MainBegin() );
        //this.Vertex_Before_PositionUpdated( this.#getVertex_Before_PositionUpdated() );
        //this.Vertex_After_WorldPosComputed( this.#getVertex_After_WorldPosComputed() );
        //this.Vertex_Before_NormalUpdated( this.#getVertex_Before_NormalUpdated() );
        this.Vertex_MainEnd( this.#getVertex_MainEnd() );

        //this.Fragment_Begin( this.#getFragment_Begin() );
        this.Fragment_Definitions( EngineUtilsShader + this.#getFragment_Definitions() );
        //this.Fragment_MainBegin( this.#getFragment_MainBegin() ); 
        //this.Fragment_Before_Lights( this.#getFragment_Before_Lights() );
        //this.Fragment_Before_Fog( this.#getFragment_Before_Fog() );
        //this.Fragment_Before_FragColor( this.#getFragment_Before_FragColor() );
        this.Fragment_Custom_Diffuse( this.#getFragment_Custom_Diffuse() );
        //this.Fragment_Custom_Alpha( this.#getFragment_Custom_Alpha() );
    }

    #getVertex_Definitions() { return `
        
        flat out vec3 flatPosition;

    `; }

    #getVertex_MainEnd() { return `

        flatPosition = position;

    `; }

    #getFragment_Definitions() { return `

        flat in vec3 flatPosition;
        
    `; }

    #getFragment_Custom_Diffuse() { return `

        vec3 position = flatPosition;
        vec3 normal = rotate( normalW, -planetRotation );

        vec3 vColorSteep = colorSteep;
        vec3 vColorMain = colorMain;
     
        if ( noise( ( ( position * -1.0 ) - noise( position ) * 50.0 ) * 0.0025 ) < 0.25 ) {

            vColorMain = colorThird;
        }

        if ( noise( ( position + noise( position ) * 50.0 ) * 0.005 ) < 0.5 ) {

            vColorMain = colorSecond;
        }

        float steep = dot( normalize( position ), normal );
        
        if ( steep <= 0.9 ) {

            diffuseColor = vColorSteep;

        } else if ( steep > 0.9 && steep <= 0.95 ) {

            diffuseColor = mix( vColorSteep, vColorMain, 0.66 );

        } else {
        
            diffuseColor = vColorMain;
        }

    `; }

}