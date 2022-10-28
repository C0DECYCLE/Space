"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Cloud extends EntityLOD implements ICloud, ISpawnable, IConfigurable {

    config = {

    };

    randomValue = 0;
    starLightDirection = new BABYLON.Vector3();

    #models = null;

    constructor( game, models, config ) {

        super( game, undefined, false, ( instance ) => this.#onLODRequest( instance ) );

        EngineUtils.configure.call( this, config );
         
        this.#createModels( models );   
    }

    post() {

        this.setBounding( EngineUtils.createBoundingCache( this.#models[0], this.scaling ) );
    }

    updateStarLightDirection( starLightDirection ) {

        this.starLightDirection.copyFrom( starLightDirection );
        EngineUtilsShader.setInstanceAttribute( this.getInstance(), "starLightDirection", this.starLightDirection );
    }

    #createModels( models ) {
        
        this.#models = models;
        this.fromModels( this.#models );
    }

    #onLODRequest( instance ) {
        
        EngineUtilsShader.setInstanceAttribute( instance, "randomValue", this.randomValue );
        EngineUtilsShader.setInstanceAttribute( instance, "cloudPosition", this.position );
    }

}