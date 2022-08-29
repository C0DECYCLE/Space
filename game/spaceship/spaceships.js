"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Spaceships {

    config = {

    };

    manager = null;
    scene = null;

    model = [];
    
    list = [];

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        EngineUtils.configure( this.config, config );

        this.#setupModel();
    }

    register( config ) {

        this.list.push( new Spaceship( this.manager, config ) );
    }

    update() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    #setupModel() {
        
        const importLods = this.scene.assets.list.get( "spaceship" ).getChildren();
        
        for ( let i = 0; i < importLods.length; i++ ) {
            
            const lod = this.scene.assets.traverse( importLods[i], mesh => {
            
                this.manager.star.shadow.receive( mesh, true, false );
            } );
            
            lod.setEnabled( false );
            this.model.push( lod );
        }
    }

}