"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetMaterial extends BABYLON.CustomMaterial {

    colors = [];

    #planet = null;
    
    constructor( planet ) {
    
        super( `planet${ planet.config.key }_material`, planet.scene );

        this.#planet = planet;

        this.#setupColors();
        this.#setupUniforms();
        this.#hookShader();
    }

    #setupColors() {
        
        const colorKeys = Object.keys( this.#planet.config.colors );

        for ( let i = 0; i < colorKeys.length; i++ ) {

            this.colors.push( [ colorKeys[i], `color${ colorKeys[i].firstLetterUppercase() }`, new BABYLON.Color3.FromHexString( this.#planet.config.colors[ colorKeys[i] ] ) ] );
        }
        
        this.specularColor = new BABYLON.Color3( 0, 0, 0 );
        this.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        this.ambientColor = new BABYLON.Color3( 0, 0, 0 );

        const ambient = this.#planet.scene.ambient;

        if ( typeof ambient !== "undefined" ) {

            for ( let i = 0; i < this.colors.length; i++ ) {

                this.colors[i][2] = this.colors[i][2].scale( ambient.intensity );
            }

            this.ambientColor = new BABYLON.Color3.FromHexString( ambient.color ).scale( ambient.materialFactor() );
        }

        for ( let i = 0; i < this.colors.length; i++ ) {

            this.colors[i][2] = EngineUtils.color3ToVector3( this.colors[i][2] );
        }
    }

    #setupUniforms() {

        for ( let i = 0; i < this.colors.length; i++ ) {

            this.AddUniform( this.colors[i][1], "vec3" );
        }

        this.onBindObservable.add( () => { 

            const effect = this.getEffect();
                
            for ( let i = 0; i < this.colors.length; i++ ) {

                effect.setVector3( this.colors[i][1], this.colors[i][2] );
            }
        } );
    }

    #hookShader() {
        
        //this.Vertex_Begin( this.#getVertex_Begin() );
        this.Vertex_Definitions( EngineUtilsShader + this.#getVertex_Definitions() );
        //this.Vertex_MainBegin( this.#getVertex_MainBegin() );
        //this.Vertex_Before_PositionUpdated( this.#getVertex_Before_PositionUpdated() );
        //this.Vertex_After_WorldPosComputed( this.#getVertex_After_WorldPosComputed() );
        //this.Vertex_Before_NormalUpdated( this.#getVertex_Before_NormalUpdated() );
        this.Vertex_MainEnd( this.#getVertex_MainEnd() );

        //this.Fragment_Begin( this.#getFragment_Begin() );
        this.Fragment_Definitions( this.#getFragment_Definitions() );
        //this.Fragment_MainBegin( this.#getFragment_MainBegin() ); 
        //this.Fragment_Before_Lights( this.#getFragment_Before_Lights() );
        //this.Fragment_Before_Fog( this.#getFragment_Before_Fog() );
        //this.Fragment_Before_FragColor( this.#getFragment_Before_FragColor() );
        this.Fragment_Custom_Diffuse( this.#getFragment_Custom_Diffuse() );
        //this.Fragment_Custom_Alpha( this.#getFragment_Custom_Alpha() );
    }

    #getVertex_Definitions() { return `
        
        flat out vec3 flatDiffuseColor;

    `; }

    #getVertex_MainEnd() { return `
    
        vec3 vColorMain = colorMain * ( 1.0 + round( noise( position * 0.005 ), 1.0 ) * 0.1 );
        vec3 vColorSteep = colorSteep; //* ( 0.8 + round( noise( position * 0.1 ), 3.0 ) * 0.4 );

        float steep = dot( normalize( position ), normal );
        
        if ( steep <= 0.85 ) {

            flatDiffuseColor = vColorSteep;

        } else if ( steep > 0.85 && steep <= 0.9 ) {

            flatDiffuseColor = mix( vColorSteep, vColorMain, 0.66 );

        } else {
        
            flatDiffuseColor = vColorMain;
        }

    `; }

    #getFragment_Definitions() { return `

        flat in vec3 flatDiffuseColor;
        
    `; }
    
    #getFragment_Custom_Diffuse() { return `

        diffuseColor = flatDiffuseColor;
        
    `; }

}