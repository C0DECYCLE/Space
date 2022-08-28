"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroids {

    config = {

    };

    manager = null;
    scene = null;

    models = [];
    
    list = [];

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        EngineUtils.configure( this.config, config );

        this.#setupModels();
    }

    register( type, config ) {

        let asteroids = null;

        switch ( type ) {

            case "cluster": asteroids = new AsteroidsCluster( this.manager, config ); break;

            case "ring": asteroids = new AsteroidsRing( this.manager, config ); break;
        }

        this.list.push( asteroids );
    }

    update() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    #setupModels() {
        
        const importLods = this.scene.assets.get( "asteroid" ).getChildren();
        
        for ( let i = 0; i < importLods.length; i++ ) {
            
            const lod = this.scene.traverse( importLods[i], mesh => {
            
                this.manager.star.shadow.receive( mesh, true, false );
            } );
            
            lod.setEnabled( false );
            this.models.push( lod );
        }
    }

}