"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Clouds {

    static lods = [

        [ 3, 0.25 ],
        [ 2, 0.1 ],
        [ 1, LOD.minimum ]
    ]

    config = {

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
        
        this.material = new CloudMaterial( this.game );

        for ( let i = 0; i < blueprints.length; i++ ) {

            this.models.push( this.#createModel( i, blueprints[i][0], blueprints[i][1] ) );
        }
    }

    #createModel( level, subdivisions, min ) {

        const mesh = BABYLON.Mesh.CreateIcoSphere( `cloud_${ level }_${ min }`, { subdivisions: subdivisions }, this.scene );
        mesh.removeVerticesData( BABYLON.VertexBuffer.NormalKind );
        mesh.removeVerticesData( BABYLON.VertexBuffer.UVKind );
        EngineUtilsShader.enableCustomInstance( mesh );

        mesh.material = this.material;
        mesh.parent = this.game.scene.assets.cache;
        mesh.setEnabled( false );

        //which levels?
        this.game.star.shadow.receive( mesh, undefined, undefined, false );

        return mesh;
    }

}