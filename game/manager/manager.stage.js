"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ManagerStage {

    #manager = null;
    #scene = null;

    #install = undefined;
    #stage = undefined;
    #run = undefined;

    #isStagingComplete = false;

    constructor( manager, install, stage, run ) {

        this.#manager = manager;
        
        this.#install = install;
        this.#stage = stage;
        this.#run = run;

        this.#scene = this.#install( () => this.#beginStaging() );
        this.#debugMaterial();
    }

    run( delta ) {

        if ( this.#scene.assets !== undefined ) {

            this.#scene.assets.update();
        }

        if ( this.#isStagingComplete === true ) {

            this.#run( delta );
        }
    }

    render() {

        if ( this.#isStagingComplete === true ) {

            this.#scene.render();
        }
    }

    #debugMaterial() {

        this.#scene.debugMaterial = new BABYLON.StandardMaterial( "debug_material", this.#scene );
        this.#scene.debugMaterial.setColorIntensity( "#ff226b", 1.0 );
        this.#scene.debugMaterial.wireframe = true;
    }

    #beginStaging() {

        this.#stage();
        this.#isStagingComplete = true;
    }

}