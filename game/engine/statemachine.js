"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class StateMachine {

    #list = new Map();
    #current = undefined;

    constructor() {

    }

    get current() {

        return this.#current;
    }

    add( state, onEnter = ( oldState, params ) => {}, onLeave = ( newState, params ) => {} ) {

        this.#list.set( state, {

            onEnter: onEnter,
            onLeave: onLeave,
        } );
    }

    set( state, params ) {

        if ( this.#list.has( state ) == true ) {

            if ( this.#current != undefined ) {

                this.#list.get( this.#current ).onLeave( state, params );
            }

            const oldState = this.#current;

            this.#current = state;
            this.#list.get( this.#current ).onEnter( oldState, params );

        } else {

            console.error( `StateMachine: Key "${ state }" doesnt exist.` );
        }
    }

    is( state ) {

        return this.#current == state;
    }
    
}