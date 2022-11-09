/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetHelper implements IPlanetHelper {

    public readonly planet: IPlanet;

    public get maskEnabled(): boolean {

        return this.maskValue;
    }

    private maskValue: boolean;
    private planetMask: BABYLON.Mesh;

    public constructor( planet: IPlanet, faces: Map< string, IPlanetQuadtree > ) {
    
        this.planet = planet;

        this.createFaces( faces );
        this.createMask();
        //this.debugInfluence();
    }

    public toggleShadow( value: boolean ): void {

        if ( this.maskValue !== value ) {

            this.planetMask.setEnabled( value );
            Star.getInstance().shadow.cast( this.planetMask, false, value );
            this.maskValue = value;

            this.planet.chunks.toggleShadows( value );
        }
    }

    public getOcclusionFallOf( distance: float, c: float = 0.8 ): float {

        return ( 1 - ( (distance / this.planet.config.radius) - c ) ).clamp( -1.05, 0.9 ) || -1.05;
    }

    public createBasicMaterial(): BABYLON.StandardMaterial {
        
        const material: BABYLON.StandardMaterial = new BABYLON.StandardMaterial( `planet${ this.planet.config.key }_basicMaterial`, scene );
        EngineExtensions.setStandardMaterialColorIntensity( material, "#534d5f", 1.0 );
        material.wireframe = true;
        material.freeze();

        return material;
    }

    private createFaces( faces: Map< string, IPlanetQuadtree > ): void {
    
        const suffix: string = "UDFBLR";
        const rotations: BABYLON.Vector3[] = [

            new BABYLON.Vector3( 0, 0, 0 ), //Up
            new BABYLON.Vector3( 2, 0, 0 ), //Down
            new BABYLON.Vector3( 1, 0, 0 ), //Forward
            new BABYLON.Vector3( -1, 0, 0 ), //Backward
            new BABYLON.Vector3( 0, 0, 1 ), //Left
            new BABYLON.Vector3( 0, 0, -1 ) //Right
        ];

        for ( let i: int = 0; i < rotations.length; i++ ) {

            faces.set( suffix[i], new PlanetQuadtree( this.planet, suffix[i], rotations[i] ) );
        }
    }
    
    private createMask(): void {

        this.planetMask = BABYLON.MeshBuilder.CreateSphere( "planet_mask", { diameter: this.planet.config.radius * 2, segments: 16 }, scene );
        this.planetMask.removeVerticesData( BABYLON.VertexBuffer.NormalKind );
        this.planetMask.removeVerticesData( BABYLON.VertexBuffer.UVKind );
        this.planetMask.isPickable = false;
        this.planetMask.material = Planets.getInstance().getMaskMaterial();
        this.planetMask.parent = this.planet.root;

        Star.getInstance().shadow.cast( this.planetMask, false, true );
        this.maskValue = true;
    }

    /*
    private debugInfluence(): void {

        const debug_influence: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere( "planet_debug_influence", { diameter: ( this.planet.config.radius + this.planet.config.influence ) * 2, segments: 32 }, scene );
        debug_influence.isPickable = false;
        debug_influence.material = debugMaterialRed;
        debug_influence.parent = this.planet.root;

        const debug_maxHeight: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere( "planet_debug_maxHeight", { diameter: ( this.planet.config.radius + this.planet.config.maxHeight ) * 2, segments: 32 }, scene );
        debug_maxHeight.isPickable = false;
        debug_maxHeight.material = debugMaterialRed;
        debug_maxHeight.parent = this.planet.root;
    }
    */

}