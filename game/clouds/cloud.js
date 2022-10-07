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

    constructor( game, config ) {

        this.game = game;
        this.scene = this.game.scene;
        this.clouds = this.game.clouds;

        EngineUtils.configure.call( this, config );
        
        this.#createLod();   
    }

    get root() {

        return this.lod.root;
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

    set randomValue( value ) {

        for ( let i = 0; i < this.lod.levels.length; i++ ) {

            EngineUtilsShader.setInstanceAttribute( this.lod.levels[i][0], "randomValue", value );
        }
    }

    update() {

        this.lod.update();
    }

    #createLod() {
        
        this.lod = new LOD( this.game );
        this.lod.fromModels( this.clouds.models, ( mesh, level ) => {} );
    }

}