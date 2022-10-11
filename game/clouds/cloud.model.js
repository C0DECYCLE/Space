"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CloudModel extends BABYLON.Mesh {

    #clouds = null;
    
    /* override */ constructor( clouds, level, subdivisions, min ) {
    
        super( `cloud_${ level }_${ min }`, clouds.scene );
    
        this.#clouds = clouds;

        this.#setupGeometry( subdivisions );
        this.#setupMesh();
    }

    #setupMesh() {

        this.isPickable = false;
        this.material = this.#clouds.material;

        EngineUtilsShader.registerInstanceAttribute( this, "randomValue", 0 );
    }

    #setupGeometry( subdivisions ) {
        
        this._originalBuilderSideOrientation = BABYLON.Mesh._GetDefaultSideOrientation( undefined );

        const options = { subdivisions: subdivisions, sideOrientation: this._originalBuilderSideOrientation };
        const vertexData = BABYLON.VertexData.CreateIcoSphere( options );

        vertexData.normals = null;
        vertexData.uvs = null;
        this.#modifyGeometry( vertexData.positions );

        vertexData.applyToMesh( this, false );
    }

    #modifyGeometry( positions ) {

        for ( let i = 0; i < positions.length; i += 3 ) {

            const position = new BABYLON.Vector3( positions[i], positions[i+1], positions[i+2] );
            
            if ( position.y < 0 ) {
                
                position.y *= 0.25;
            }

            positions[i] = position.x;
            positions[i+1] = position.y;
            positions[i+2] = position.z;
        }
    }

}