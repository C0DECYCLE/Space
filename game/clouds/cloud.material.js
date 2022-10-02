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
        this.#hookShader();
    }

    #setupColor() {
        
        this.setColorIntensity( this.#clouds.config.color, 1.0 );

        //multiple colors by instanceBuffer and unforms
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
        //this.Fragment_Definitions( this.#getFragment_Definitions() );
        //this.Fragment_MainBegin( this.#getFragment_MainBegin() ); 
        //this.Fragment_Before_Lights( this.#getFragment_Before_Lights() );
        //this.Fragment_Before_Fog( this.#getFragment_Before_Fog() );
        //this.Fragment_Before_FragColor( this.#getFragment_Before_FragColor() );
        this.Fragment_Custom_Diffuse( this.#getFragment_Custom_Diffuse() );
        this.Fragment_Custom_Alpha( this.#getFragment_Custom_Alpha() );
        //this.Fragment_MainEnd( this.#getFragment_MainEnd() ); 
    }

    #getVertex_Definitions() { return `

        ${ EngineUtilsShader.code }


    `; }

    #getVertex_Before_PositionUpdated() { return `
        
        #if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
        

        
        #endif

        //mat4 finWorld=mat4(world0,world1,world2,world3);
        positionUpdated *= 1.0 + abs( noise( (position /*+ vec3(finWorld * vec4(0.0, 0.0, 0.0, 1.0)) * 0.001*/ ) * 2.0 ) - 0.5 ) * 0.75;

    `; }

    #getFragment_Custom_Diffuse() { return `
        
        #if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)

            baseColor.rgb /= vColor.rgb;

        #endif
        
    `; } 

    #getFragment_Custom_Alpha() { return `
        
        #if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)

            //alpha = 0.5;//${ EngineUtilsShader.parseCustomInstanceKey( 0 ) };

        #endif
        
        alpha = 0.5;

    `; }


}