"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Cloud {

    config = {

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

    set parent( value ) {

        this.lod.parent = value;
    }

    update() {

        this.lod.update();
    }

    #createLod() {
        
        this.lod = new LOD( this.game );
        this.lod.fromModels( this.clouds.models, ( mesh, level ) => {

            //which level?
            this.game.star.shadow.cast( mesh );
        } );
    }

}