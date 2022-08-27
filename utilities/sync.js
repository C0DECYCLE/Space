"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Sync {

    #length = 0;
    #callback = undefined;
    #hasFired = false;

    constructor( length, callback ) {
        
        this.#length = length || this.#length;
        this.#callback = callback;

        this.#test();
    }

    next() {

        if ( this.#hasFired === true ) {

            console.error( "Sync: Has already been executed." );

            return;
        }

        this.#length--;

        this.#test();
    }

    #test() {

        if ( this.#length <= 0 ) {

            if ( typeof this.#callback === "function" ) {

                this.#callback();
                this.#hasFired = true;

            } else {

                console.error( "Sync: Type of callback must be a function." );
            }
        }
    }

}