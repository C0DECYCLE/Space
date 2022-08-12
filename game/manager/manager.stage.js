"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ManagerStage {

    parent = null;

    #install = undefined;
    #stage = undefined;
    #run = undefined;

    #isStagingComplete = false;

    constructor( parent, install, stage, run ) {

        this.parent = parent;
        
        this.#install = install;
        this.#stage = stage;
        this.#run = run;

        let scene = this.#install();
        
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