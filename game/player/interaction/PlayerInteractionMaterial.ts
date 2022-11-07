/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlayerInteractionMaterial extends BABYLON.CustomMaterial implements IPlayerInteractionMaterial {

    public static interactableColor: BABYLON.Vector3 = EngineUtils.color3ToVector3( BABYLON.Color3.FromHexString( UI.NEUTRAL ) );

    private readonly screenSize: BABYLON.Vector2;

    public constructor( name: string ) {
    
        super( `${ name }-interactable`, scene );

        this.screenSize = Engine.getInstance().screenSize;

        this.setupUniforms();
        this.setupAttributes();
        this.hookShader();
    }

    private setupUniforms(): void {

        this.AddUniform( "screenSize", "vec2", undefined );
        this.AddUniform( "interactableColor", "vec3", undefined );

        this.onBindObservable.add( ( _mesh: BABYLON.AbstractMesh ): void => { 

            const effect: BABYLON.Effect = this.getEffect();

            effect.setVector2( "screenSize", this.screenSize );
            effect.setVector3( "interactableColor", PlayerInteractionMaterial.interactableColor );
        } );
    }

    private setupAttributes(): void {

        this.AddAttribute( "interactable" );
    }

    private hookShader(): void {
        
        //this.Vertex_Begin( this.getVertex_Begin() );
        this.Vertex_Definitions( this.getVertex_Definitions() );
        //this.Vertex_MainBegin( this.getVertex_MainBegin() );
        //this.Vertex_Before_PositionUpdated( this.getVertex_Before_PositionUpdated() );
        //this.Vertex_After_WorldPosComputed( this.getVertex_After_WorldPosComputed() );
        //this.Vertex_Before_NormalUpdated( this.getVertex_Before_NormalUpdated() );
        this.Vertex_MainEnd( this.getVertex_MainEnd() );

        //this.Fragment_Begin( this.getFragment_Begin() );
        this.Fragment_Definitions( this.getFragment_Definitions() );
        //this.Fragment_MainBegin( this.getFragment_MainBegin() ); 
        //this.Fragment_Before_Lights( this.getFragment_Before_Lights() );
        //this.Fragment_Before_Fog( this.getFragment_Before_Fog() );
        //this.Fragment_Before_FragColor( this.getFragment_Before_FragColor() );
        //this.Fragment_Custom_Diffuse( this.getFragment_Custom_Diffuse() );
        //this.Fragment_Custom_Alpha( this.getFragment_Custom_Alpha() );
        this.Fragment_MainEnd( this.getFragment_MainEnd() ); 
    }

    private getVertex_Definitions(): string { return `

        attribute float interactable;
        out float vInteractable;
        
    `; }

    private getVertex_MainEnd(): string { return `

        vInteractable = interactable;
        
    `; }

    private getFragment_Definitions(): string { return `

        ${ EngineUtilsShader.code }

        in float vInteractable;

        float pattern() {
            vec2 uv = gl_FragCoord.xy / screenSize;
            float v = ( uv.x + uv.y ) / 2.0;
            float a = abs( cos( v * PI * 100.0 ) );
            if ( a > 0.7 ) {
                return 1.0;
            } else {
                return 0.5;
            }
        }
        
    `; }

    private getFragment_MainEnd(): string { return `

        if ( vInteractable > 0.9 && vInteractable < 1.1 ) {
            gl_FragColor += vec4( interactableColor * pattern(), 1.0 ) * 0.25;
        }
        
    `; }

}