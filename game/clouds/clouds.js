"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Clouds {

    static lods = [

        [ 7, 0.25 ],
        [ 4, 0.1 ],
        [ 2, AbstractLOD.minimum ]
    ]

    config = {

    };

    game = null;
    scene = null;
    
    materials = new Map();
    list = [];

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure.call( this, config );
    }

    createModels( blueprints, material ) {

        const models = [];

        for ( let i = 0; i < blueprints.length; i++ ) {

            models.push( this.#createModel( i, blueprints[i][0], blueprints[i][1], material ) );
        }

        return models;
    }

    #createModel( level, subdivisions, min, material ) {

        const mesh = new CloudModel( this, level, subdivisions, min, material );

        mesh.parent = this.game.scene.assets.cache;
        mesh.setEnabled( false );

        const invMin = Math.round( 1 / AbstractLOD.getMinimum( mesh.name ) );
            
        mesh.entitymanager = new EntityManager( mesh.name, this.scene, () => this.game.scene.assets.instance( mesh, mesh => {} ), invMin * 4, invMin );

        return mesh;
    }


}