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

    starLightDirection = new BABYLON.Vector3();
    planetRadius = 0;

    constructor( game, config ) {

        super( game, false, false, ( instance ) => this.#onLODRequest( instance ) );

        EngineUtils.configure.call( this, config );
         
        this.#createModels();   
    }

    post() {

        this.setBounding( EngineUtils.createBoundingCache( this.game.clouds.models[0], this.scaling ) );
    }

    updateStarLightDirection( starLightDirection ) {

        this.starLightDirection.copyFrom( starLightDirection );
        EngineUtilsShader.setInstanceAttribute( this.getInstance(), "starLightDirection", this.starLightDirection );
    }

    #createModels() {
        
        this.fromModels( this.game.clouds.models );
    }

    #onLODRequest( instance ) {
        
        EngineUtilsShader.setInstanceAttribute( instance, "randomValue", this.randomValue );

        EngineUtilsShader.setInstanceAttribute( instance, "cloudPosition", this.position );
        EngineUtilsShader.setInstanceAttribute( instance, "planetRadius", this.planetRadius );
    }

}