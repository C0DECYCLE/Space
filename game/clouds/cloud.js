"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Cloud extends EntityLOD {

    config = {

    };

    randomValue = 0;

    constructor( game, config ) {

        super( game, false, false, ( instance ) => this.#onLODRequest( instance ) );

        EngineUtils.configure.call( this, config );
         
        this.#createModels();   
    }

    post() {

        this.setBounding( EngineUtils.createBoundingCache( this.game.clouds.models[0], this.scaling ) );
    }

    #createModels() {
        
        this.fromModels( this.game.clouds.models );
    }

    #onLODRequest( instance ) {
        
        EngineUtilsShader.setInstanceAttribute( instance, "randomValue", this.randomValue );
    }

}