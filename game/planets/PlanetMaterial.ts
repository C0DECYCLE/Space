/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetMaterial extends BABYLON.CustomMaterial implements IPlanetMaterial {
    
    public readonly planet: IPlanet;

    public readonly colors: [ string, string, BABYLON.Color3 | BABYLON.Vector3 ][] = [];
    
    public constructor( planet: IPlanet ) {
    
        super( `planet${ planet.config.key }_material`, scene );

        this.planet = planet;

        this.setupColors();
        this.setupUniforms();
        this.hookShader();
    }

    private setupColors(): void {
        
        const colorKeys: string[] = Object.keys( this.planet.config.colors );
        const colorList: BABYLON.Color3[] = [];

        for ( let i: number = 0; i < colorKeys.length; i++ ) {

            const color3: BABYLON.Color3 = BABYLON.Color3.FromHexString( this.planet.config.colors[ colorKeys[i] ] );

            this.colors.push( [ colorKeys[i], `color${ colorKeys[i].firstLetterUppercase() }`, color3 ] );
            colorList.push( color3 );
        }
        
        EngineExtensions.setupStandardMaterialDefault( this, colorList );

        for ( let i: number = 0; i < this.colors.length; i++ ) {

            const color3: BABYLON.Color3 | BABYLON.Vector3 = this.colors[i][2];

            if ( color3 instanceof BABYLON.Color3 ) {

                this.colors[i][2] = EngineUtils.color3ToVector3( color3 );
            }
        }
    }

    private setupUniforms(): void {

        this.AddUniform( "planetRotation", "vec3", undefined );

        for ( let i: number = 0; i < this.colors.length; i++ ) {

            this.AddUniform( this.colors[i][1], "vec3", undefined );
        }

        this.onBindObservable.add( ( _eventData: BABYLON.AbstractMesh, _eventState: BABYLON.EventState): void => { 

            const effect: BABYLON.Effect = this.getEffect();

            effect.setVector3( "planetRotation", this.planet.rotationQuaternion.toEulerAngles() );

            for ( let i: number = 0; i < this.colors.length; i++ ) {

                const color3: BABYLON.Color3 | BABYLON.Vector3 = this.colors[i][2];

                if ( color3 instanceof BABYLON.Vector3 ) {

                    effect.setVector3( this.colors[i][1], color3 );
                }
            }
        } );
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
        this.Fragment_Custom_Diffuse( this.getFragment_Custom_Diffuse() );
        //this.Fragment_Custom_Alpha( this.getFragment_Custom_Alpha() );
    }

    private getVertex_Definitions(): string { return `

        flat out vec3 flatPosition;

    `; }

    private getVertex_MainEnd(): string { return `

        flatPosition = position;

    `; }

    private getFragment_Definitions(): string { return `

        ${ EngineUtilsShader.code }

        flat in vec3 flatPosition;
        
    `; }

    private getFragment_Custom_Diffuse(): string { return `

        vec3 position = flatPosition;
        vec3 normal = rotate( normalW, -planetRotation );

        vec3 vColorSteep = colorSteep;
        vec3 vColorMain = colorMain;
        if ( noise( ( (position * -1.0) - noise(position) * 50.0 ) * 0.0025 ) < 0.25 ) {
            vColorMain = colorThird;
        }
        if ( noise( (position + noise(position) * 50.0) * 0.005 ) < 0.5 ) {
            vColorMain = colorSecond;
        }

        float steep = dot( normalize(position), normal );
        if ( steep <= 0.9 ) {
            diffuseColor = vColorSteep;
        } else if ( steep > 0.9 && steep <= 0.95 ) {
            diffuseColor = mix( vColorSteep, vColorMain, 0.66 );
        } else {
            diffuseColor = vColorMain;
        }

    `; }

}