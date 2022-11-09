/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudModel extends BABYLON.Mesh implements ICloudModel {

    public readonly clouds: IClouds;
    
    public constructor( clouds: IClouds, level: int, subdivisions: int, min: float, material: BABYLON.StandardMaterial ) {
    
        super( `cloud_${ level }_${ min }`, scene );
    
        this.clouds = clouds;

        this.setupGeometry( subdivisions );
        this.setupMesh( material );
    }

    private setupMesh( material: BABYLON.StandardMaterial ): void {

        this.isPickable = false;
        this.material = material;

        EngineUtilsShader.registerInstanceAttribute( this, "randomValue", 0 );
        EngineUtilsShader.registerInstanceAttribute( this, "cloudPosition", new BABYLON.Vector3() );
        EngineUtilsShader.registerInstanceAttribute( this, "starLightDirection", new BABYLON.Vector3() );
    }

    private setupGeometry( subdivisions: int ): void {
        
        this._originalBuilderSideOrientation = BABYLON.Mesh._GetDefaultSideOrientation();

        const options: object = { subdivisions: subdivisions, sideOrientation: this._originalBuilderSideOrientation };
        const vertexData: BABYLON.VertexData = BABYLON.CreateIcoSphereVertexData( options );

        vertexData.normals = null;
        vertexData.uvs = null;

        if ( vertexData.positions !== null ) {

            this.modifyGeometry( vertexData.positions );
        }

        vertexData.applyToMesh( this, false );
    }

    private modifyGeometry( positions: BABYLON.FloatArray ): void {

        for ( let i: int = 0; i < positions.length; i += 3 ) {

            const position: BABYLON.Vector3 = new BABYLON.Vector3( positions[i], positions[i+1], positions[i+2] );
            
            if ( position.y < 0 ) {
                
                position.y *= 0.25;
            }

            positions[i] = position.x;
            positions[i+1] = position.y;
            positions[i+2] = position.z;
        }
    }

}