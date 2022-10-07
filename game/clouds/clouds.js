"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Clouds {

    static lods = [

        [ 6, 0.25 ],
        [ 3, 0.1 ],
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

        const mesh = new CloudModel( this, level, subdivisions, min );

        mesh.parent = this.game.scene.assets.cache;
        mesh.setEnabled( false );

        return mesh;
    }


}