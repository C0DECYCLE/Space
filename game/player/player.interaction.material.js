"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerInteractionMaterial extends BABYLON.CustomMaterial {

    static interactableColor = EngineUtils.color3ToVector3( BABYLON.Color3.FromHexString( UI.NEUTRAL ) );

    #game = null;
    
    constructor( name, game ) {
    
        super( `${ name }-interactable`, game.scene );

        this.#game = game;

        this.#setupColors();
        this.#setupUniforms();
        this.#hookShader();
    }

    #setupColors() {
        
    }

    #setupUniforms() {

        this.AddUniform( "interactableColor", "vec3" );

        this.onBindObservable.add( ( /*mesh*/ ) => { 

            const effect = this.getEffect();

            effect.setVector3( "interactableColor", PlayerInteractionMaterial.interactableColor );
        } );
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
        this.Fragment_Definitions( EngineUtilsShader + this.#getFragment_Definitions() );
        //this.Fragment_MainBegin( this.#getFragment_MainBegin() ); 
        //this.Fragment_Before_Lights( this.#getFragment_Before_Lights() );
        //this.Fragment_Before_Fog( this.#getFragment_Before_Fog() );
        //this.Fragment_Before_FragColor( this.#getFragment_Before_FragColor() );
        this.Fragment_Custom_Diffuse( this.#getFragment_Custom_Diffuse() );
        //this.Fragment_Custom_Alpha( this.#getFragment_Custom_Alpha() );
        this.Fragment_MainEnd( this.#getFragment_MainEnd() ); 
    }

    #getFragment_Definitions() { return `

        float pattern() {
            float a = abs( cos( (gl_FragCoord.x + gl_FragCoord.y) * 0.2 ) );
            if ( a > 0.666 ) {
                return 1.0;
            } else {
                return 0.5;
            }
        }
        
    `; }

    #getFragment_Custom_Diffuse() { return `
        
        #if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)

            baseColor.rgb /= vColor.rgb;

        #endif
        
    `; }

    #getFragment_MainEnd() { return `

        #if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)

            bool highlight = vColor.r == 1.0;
            
            if ( highlight ) {

                gl_FragColor += vec4( interactableColor * pattern(), 1.0 ) * 0.25;
            }
            
        #endif
        
    `; }

}