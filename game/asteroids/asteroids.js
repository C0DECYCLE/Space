"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroids {

    config = {

    };

    game = null;
    scene = null;

    variants = {

        keys: [ "a", "b" ]
    };

    list = [];

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure.call( this, config );

        this.#setupVariants();
    }

    register( type, config ) {

        let asteroids = null;

        switch ( type ) {

            case "cluster": asteroids = new AsteroidsCluster( this.game, config ); break;

            case "ring": asteroids = new AsteroidsRing( this.game, config ); break;
        }

        this.list.push( asteroids );
    }

    update() {

        for ( let i = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    #setupVariants() {

        for ( let i = 0; i < this.variants.keys.length; i++ ) {

            this.variants[ this.variants.keys[i] ] = this.#setupModels( this.variants.keys[i] );
        }
    }

    #setupModels( variant ) {
        
        const models = [];
        const importLods = this.scene.assets.list.get( `asteroid-${ variant }` ).getChildren();

        for ( let i = 0; i < importLods.length; i++ ) {
            
            const model = this.scene.assets.traverse( importLods[i], mesh => {
            
                if ( i === 0 ) {

                    this.game.star.shadow.receive( mesh );
                } 
            } );

            const invMin = Math.round( 1 / AbstractLOD.getMinimum( model.name ) );
            
            model.entitymanager = new EntityManager( model.name, this.scene, () => this.game.scene.assets.instance( model, mesh => {} ), invMin * 4, invMin );
            models.push( model );
        }

        return models;
    }

}