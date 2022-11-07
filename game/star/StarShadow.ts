/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class StarShadow implements IStarShadow {

    public config: IConfig = new Config(  

        [ "radius", 2048 ],
        [ "resolution", 2048 ],

        [ "bias", 0.005 ],
        [ "blend", 0.3 ],
        [ "lambda", 0.85 ],

        [ "filter", "PCF" ], //"NONE" "PCF" "CONHRD"
        [ "quality", "HIGH" ] //LOW MEDIUM HIGH
    );

    public readonly star: IStar;
    public readonly light: BABYLON.DirectionalLight;

    public generator: BABYLON.CascadedShadowGenerator;
    public readonly renderList: SmartObjectArray< BABYLON.AbstractMesh > = new SmartObjectArray< BABYLON.AbstractMesh >( 250 );

    private readonly debug: boolean = false;
    private frustumViewer: BABYLON.DirectionalLightFrustumViewer;

    public constructor( star: IStar, light: BABYLON.DirectionalLight ) {
        
        this.star = star;
        this.light = light;

        this.configureLight();
        this.createGenerator();
    }

    public cast( mesh: BABYLON.AbstractMesh, recursiv: boolean, value: boolean ): void {

        this.meshRecurse( mesh, ( m: BABYLON.AbstractMesh ): void => this.meshCast( m, value ), recursiv );
    }
 
    public receive( mesh: BABYLON.AbstractMesh, recursiv: boolean, value: boolean ): void {
        
        this.meshRecurse( mesh, ( m: BABYLON.AbstractMesh ): void => this.meshReceive( m, value ), recursiv );
    }

    public update(): void {

        if ( this.debug === true ) {

            this.frustumViewer?.update();
        }
    }

    private configureLight(): void {

        this.light.autoCalcShadowZBounds = false;
        this.light.autoUpdateExtends = false;

        this.light.orthoTop = -this.config.radius;
        this.light.orthoBottom = this.config.radius;
        this.light.orthoLeft = -this.config.radius;
        this.light.orthoRight = this.config.radius;

        this.light.shadowMinZ = -this.config.radius;
        this.light.shadowMaxZ = this.config.radius;
        
        this.light.shadowOrthoScale = 0;

        if ( this.debug === true ) {

            this.frustumViewer = new BABYLON.DirectionalLightFrustumViewer( this.light, Camera.getInstance().camera );
        } 
    }

    private createGenerator(): void {

        this.generator = new BABYLON.CascadedShadowGenerator( this.config.resolution, this.light );
        this.generator.bias = this.config.bias;
        this.generator.normalBias = 0.0;

        this.generator.setDarkness( 0.0 );
        this.generator.frustumEdgeFalloff = 0.0;

        this.generator.transparencyShadow = false;
        this.generator.enableSoftTransparentShadow = false;

        this.generator.usePercentageCloserFiltering = this.config.filter === "PCF";
        this.generator.useContactHardeningShadow = this.config.filter === "CONHRD";

        switch( this.config.quality ) {

            case "LOW": this.generator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW; break;
            case "MEDIUM": this.generator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM; break;
            case "HIGH": this.generator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH; break;
        }

        this.generator.debug = this.debug;
        this.generator.lambda = this.config.lambda;
        this.generator.numCascades = 4;

        this.generator.cascadeBlendPercentage = this.config.blend;
        this.generator.stabilizeCascades = this.config.stabilize;

        this.generator.shadowMaxZ = this.config.radius;
        this.generator.penumbraDarkness = 1.0;

        const map: BABYLON.RenderTargetTexture | null = this.generator.getShadowMap();

        if ( map !== null ) {
            
            map.renderList = this.renderList;
        }
    }

    private meshRecurse( mesh: BABYLON.AbstractMesh, call: ( m: BABYLON.AbstractMesh ) => void, recursiv: boolean ): void {

        call( mesh );

        if ( recursiv === true ) {

            const children = mesh.getChildMeshes();

            for ( let i = 0; i < children.length; i++ ) {

                call( children[i] );
            }
        }
    }

    private meshCast( mesh: BABYLON.AbstractMesh, value: boolean ): void {
        
        if ( value ) {

            this.renderList.add( mesh );

        } else {

            this.renderList.delete( mesh );
        }
    }

    private meshReceive( mesh: BABYLON.AbstractMesh, value: boolean ): void {

        mesh.receiveShadows = value;
    }

}