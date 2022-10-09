"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Cloud {

    config = {

        random: Math.random,

        width: () => Math.ceil( this.config.random() * 10 ) + 10,
        height: () => Math.ceil( this.config.random() * 10 ) + 10,
        depth: () => Math.ceil( this.config.random() * 10 ) + 10,

        scale: () => Math.ceil( this.config.random() * 5 )
    };

    game = null;
    scene = null;
    clouds = null;

    lod = null;
    randomValue = 0;

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;
        this.clouds = this.game.clouds;

        EngineUtils.configure.call( this, config );
        
        this.#createLod();   
    }

    get position() {
        
        return this.lod.position;
    }

    get rotationQuaternion() {
        
        return this.lod.rotationQuaternion;
    }

    get scaling() {
        
        return this.lod.scaling;
    }

    set parent( value ) {

        this.lod.parent = value;
    }

    update() {

        this.lod.update();
    }

    post() {

        this.lod.setBounding( EngineUtils.createBoundingCache( this.clouds.models[0], this.scaling ) );
    }

    #createLod() {
        
        this.lod = new EntityLOD( this.game, false, false, ( instance ) => this.#onLODRequest( instance ) );
        this.lod.fromModels( this.clouds.models );
    }

    #onLODRequest( instance ) {
        
        EngineUtilsShader.setInstanceAttribute( instance, "randomValue", this.randomValue );
    }

}