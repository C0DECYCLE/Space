"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AbstractLOD {

    static minimum = 0.01;

    game = null;
    levels = [];
    size = undefined;

    #isEnabled = true;

    #coverage = undefined;
    #currentLevel = undefined;
    #lastValidLevel = 0;

    constructor( game, size ) {

        this.game = game;
        this.size = size;
    }

    get isVisible() {

        return this.#currentLevel !== undefined;
    }

    add( level, min ) {

        this.levels.push( [ level, min.clamp( AbstractLOD.minimum, Infinity ) ] );
    }

    setEnabled( value ) {

        this.set( value === true ? this.#lastValidLevel : -1 );
    }

    set( level ) {

        this.#setLevel( level );
        this.#isEnabled = this.isVisible;
    }

    update() {
        
        if ( this.#isEnabled === false ) {

            return;
        }

        this.#coverage = this.game.camera.getScreenCoverage( this.root || this, this.size );
        this.#setLevel( this.#getLevelFromCoverage( this.#coverage ) );
    }

    disposeCurrent( currentLevel ) {

        this.#currentLevel = undefined;
    }

    makeCurrent( level ) {

        this.#currentLevel = level;
        this.#lastValidLevel = this.#currentLevel;
    }

    #setLevel( level ) {

        if ( level !== this.#currentLevel ) {

            this.disposeCurrent( this.#currentLevel );
            this.makeCurrent( level );
        }
    }

    #getLevelFromCoverage( coverage ) {

        for ( let i = 0; i < this.levels.length; i++ ) {

            if ( ( i - 1 < 0 ? coverage <= Infinity : coverage < this.levels[ i - 1 ][1] ) && coverage >= this.levels[i][1] ) {

                return i;
            }
        }
    }

}