"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudMaterial extends BABYLON.CustomMaterial {

    #game = null;
    
    constructor( game ) {
    
        super( `cloud_material`, game.scene );

        this.#game = game;

        this.#hookShader();
    }

    #hookShader() {
        
        //this.Vertex_Begin( this.#getVertex_Begin() );
        //this.Vertex_Definitions( this.#getVertex_Definitions() );
        //this.Vertex_MainBegin( this.#getVertex_MainBegin() );
        //this.Vertex_Before_PositionUpdated( this.#getVertex_Before_PositionUpdated() );
        //this.Vertex_After_WorldPosComputed( this.#getVertex_After_WorldPosComputed() );
        //this.Vertex_Before_NormalUpdated( this.#getVertex_Before_NormalUpdated() );
        //this.Vertex_MainEnd( this.#getVertex_MainEnd() );

        //this.Fragment_Begin( this.#getFragment_Begin() );
        //this.Fragment_Definitions( this.#getFragment_Definitions() );
        //this.Fragment_MainBegin( this.#getFragment_MainBegin() ); 
        //this.Fragment_Before_Lights( this.#getFragment_Before_Lights() );
        //this.Fragment_Before_Fog( this.#getFragment_Before_Fog() );
        //this.Fragment_Before_FragColor( this.#getFragment_Before_FragColor() );
        this.Fragment_Custom_Diffuse( this.#getFragment_Custom_Diffuse() );
        //this.Fragment_Custom_Alpha( this.#getFragment_Custom_Alpha() );
        //this.Fragment_MainEnd( this.#getFragment_MainEnd() ); 
    }

    #getFragment_Custom_Diffuse() { return `
        
        #if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)

            baseColor.rgb /= vColor.rgb;

        #endif
        
    `; }

}