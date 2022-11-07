/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudMaterial extends BABYLON.CustomMaterial implements ICloudMaterial {

    public readonly clouds: IClouds;
    
    public constructor( clouds: IClouds, color: string ) {
    
        super( `cloud_material_${ color }`, scene );

        this.clouds = clouds;

        this.setupColor( color );
        this.setupTransparency();
        this.setupAttributes();
        this.hookShader();

        this.clouds.materials.set( color, this );
    }

    private setupColor( color: string ): void {
        
        EngineExtensions.setStandardMaterialColorIntensity( this, color, 1.0 );

        BABYLON.Color3.LerpToRef( this.emissiveColor, BABYLON.Color3.FromHexString( color ), 0.5, this.emissiveColor );
        this.ambientColor.scaleToRef( 1.5, this.ambientColor );
    }

    private setupTransparency(): void {

        this.alpha = 0.99;
        this.needDepthPrePass = true;
        this.backFaceCulling = false;
    }

    private setupAttributes(): void {

        this.AddAttribute( "randomValue" );
        this.AddAttribute( "cloudPosition" );
        this.AddAttribute( "starLightDirection" );
    }

    private hookShader(): void {
        
        //this.Vertex_Begin( this.getVertex_Begin() );
        this.Vertex_Definitions( this.getVertex_Definitions() );
        //this.Vertex_MainBegin( this.getVertex_MainBegin() );
        this.Vertex_Before_PositionUpdated( this.getVertex_Before_PositionUpdated() );
        //this.Vertex_After_WorldPosComputed( this.getVertex_After_WorldPosComputed() );
        //this.Vertex_Before_NormalUpdated( this.getVertex_Before_NormalUpdated() );
        //this.Vertex_MainEnd( this.getVertex_MainEnd() );

        //this.Fragment_Begin( this.getFragment_Begin() );
        this.Fragment_Definitions( this.getFragment_Definitions() );
        //this.Fragment_MainBegin( this.getFragment_MainBegin() ); 
        this.Fragment_Custom_Diffuse( this.getFragment_Custom_Diffuse() );
        //this.Fragment_Custom_Alpha( this.getFragment_Custom_Alpha() );
        //this.Fragment_Before_Lights( this.getFragment_Before_Lights() );
        //this.Fragment_Before_Fog( this.getFragment_Before_Fog() );
        this.Fragment_Before_FragColor( this.getFragment_Before_FragColor() );
        //this.Fragment_MainEnd( this.getFragment_MainEnd() ); 
    }

    private getVertex_Definitions(): string { return `

        ${ EngineUtilsShader.code }

        attribute float randomValue;

        attribute vec3 cloudPosition;
        attribute vec3 starLightDirection;

        flat out vec3 vNoisePosition;
        flat out float vPlanetOcclusion;
        float cloudLightBlur = 0.5;
        float cloudLightDark = 0.05;

    `; }

    private getVertex_Before_PositionUpdated(): string { return `
        
        positionUpdated *= 1.0 + ( noise( (position + randomValue) * 2.0 ) - 0.5 ) * 0.75;
        vNoisePosition = cloudPosition + positionUpdated * 2.0;

        float cloudLightDot = dot( normalize( cloudPosition ), starLightDirection ) * -1.0;
        vPlanetOcclusion = 1.0;
        if ( cloudLightDot < cloudLightBlur ) {
            vPlanetOcclusion = cloudLightDark;
            if ( cloudLightDot > -cloudLightBlur ) {
                vPlanetOcclusion = cloudLightDark + (1.0 - cloudLightDark) * ((cloudLightDot + cloudLightBlur) / (cloudLightBlur * 2.0));
            }
        }

    `; }

    private getFragment_Definitions(): string { return `

        ${ EngineUtilsShader.code }

        flat in vec3 vNoisePosition;
        flat in float vPlanetOcclusion;
        
    `; }

    private getFragment_Custom_Diffuse(): string { return `

        diffuseColor *= vPlanetOcclusion;
        
    `; }

    private getFragment_Before_FragColor(): string { return `

        color.rgb -= emissiveColor * (1.0 - vPlanetOcclusion) * 0.75;
        color.rgb += vAmbientColor * (1.0 - vPlanetOcclusion) * 0.65;
        color.rgb = clamp( color.rgb, 0.0, 1.0 );
        color.rgb *= 0.05 + vPlanetOcclusion;
        color.a = 0.5 + vPlanetOcclusion * 0.5;
        color.a *= 0.5 + noise( vNoisePosition );
        color = clamp( color, 0.0, 1.0 );
        
    `; }

}