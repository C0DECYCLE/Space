"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ManagerStage {

    #manager = null;

    #install = undefined;
    #stage = undefined;
    #run = undefined;

    #isStagingComplete = false;

    constructor( manager, install, stage, run ) {

        this.#manager = manager;
        
        this.#install = install;
        this.#stage = stage;
        this.#run = run;

        const scene = this.#install();
        
        scene.onReadyObservable.add( () => this.#onReadyObservable() );
    }

    run( delta ) {

        if ( this.#isStagingComplete == true ) {

            this.#run( delta );
        }
    }

    #onReadyObservable() {

        this.#stage();
        this.#isStagingComplete = true;
    }

}