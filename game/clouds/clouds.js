"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Clouds {

    static lods = [

        [ 12, 0.25 ],
        [ 2, 0.1 ],
        [ 1, LOD.minimum ]
    ]

    config = {

        color: "#ffffff"
    };

    game = null;
    scene = null;

    material = null;
    models = [];
    
    list = [];

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure.call( this, config );

        this.#createModels( Clouds.lods );
    }

    #createModels( blueprints ) {
        
        this.material = new CloudMaterial( this );

        for ( let i = 0; i < blueprints.length; i++ ) {

            this.models.push( this.#createModel( i, blueprints[i][0], blueprints[i][1] ) );
        }
    }

    #createModel( level, subdivisions, min ) {

        const mesh = BABYLON.Mesh.CreateIcoSphere( `cloud_${ level }_${ min }`, { subdivisions: subdivisions, updatable: true }, this.scene );
        mesh.removeVerticesData( BABYLON.VertexBuffer.NormalKind );
        mesh.removeVerticesData( BABYLON.VertexBuffer.UVKind );
        this.#modifyModel( mesh );
        //EngineUtilsShader.enableCustomInstance( mesh );

        mesh.material = this.material;
        mesh.parent = this.game.scene.assets.cache;
        mesh.setEnabled( false );

        return mesh;
    }

    #modifyModel( mesh ) {

        const positions = mesh.getVerticesData( BABYLON.VertexBuffer.PositionKind );

        for ( let i = 0; i < positions.length; i += 3 ) {

            const position = new BABYLON.Vector3( positions[i], positions[i+1], positions[i+2] );
            
            if ( position.y < 0 ) {
                
                position.y *= 0.25;
            }

            positions[i] = position.x;
            positions[i+1] = position.y;
            positions[i+2] = position.z;
        }

        mesh.updateVerticesData( BABYLON.VertexBuffer.PositionKind, positions );
    }

}