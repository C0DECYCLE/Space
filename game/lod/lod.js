"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class LOD {

    static minimum = 0.01;

    levels = [];
    coverage = undefined;

    #game = null;
    #isEnabled = true;
    #isVisible = false;
    #lastLevel = 0;

    constructor( game ) {

        this.#game = game;
    }
    
    get root() {

        return this.levels[0][0];
    }

    get position() {
        
        return this.root.position;
    }

    get rotationQuaternion() {
        
        return this.root.rotationQuaternion;
    }

    get scaling() {
        
        return this.root.scaling;
    }
    
    set parent( value ) {

        for ( let i = 0; i < this.levels.length; i++ ) {

            this.levels[i][0].parent = value;
        }
    }

    get isVisible() {

        return this.#isVisible;
    }

    get maxVisibleDistance() {

        return EngineUtils.getBoundingSize( this.root ) / LOD.minimum;
    }

    fromSingle( node ) {

        this.add( node, LOD.minimum );
    }

    fromModels( models, onEveryMesh ) {
        
        for ( let i = 0; i < models.length; i++ ) {
            
            this.add( this.#game.scene.assets.instance( models[i], mesh => onEveryMesh( mesh, i ) ), Number( models[i].name.split( "_" )[2] ) );
        }
    }

    add( node, min ) {

        if ( this.levels.length > 0 ) {

            node.position = this.position;
            node.rotationQuaternion = this.rotationQuaternion;
            node.scaling = this.scaling;

        } else if ( !node.rotationQuaternion ) {
            
            node.rotationQuaternion = node.rotation.toQuaternion();
        }

        this.levels.push( [ node, min.clamp( LOD.minimum, Infinity ) ] );
    }

    setEnabled( value ) {

        this.set( value === true ? this.#lastLevel : -1 );
    }

    set( level ) {

        this.#isVisible = false;
        this.#lastLevel = undefined;

        for ( let i = 0; i < this.levels.length; i++ ) {

            this.levels[i][0].setEnabled( i === level );

            if ( i === level ) {

                this.#isVisible = true;
                this.#lastLevel = i;
            }
        }

        this.#isEnabled = this.#isVisible;
    }

    // !!! Instead of toggle all, remember the current, if new is diffrent toggle the current and new ( O(2) instead of O(n) ) !!!
    // !!! Initialize the levels and location abstract and request / return to entity managers instead of toggle on of !!!

    update() {
        
        if ( this.#isEnabled === false ) {

            return;
        }

        this.coverage = this.#game.camera.getScreenCoverage( this.root );
        this.#isVisible = false;

        for ( let i = 0; i < this.levels.length; i++ ) {

            this.levels[i][0].setEnabled( ( i - 1 < 0 ? this.coverage <= Infinity : this.coverage < this.levels[ i - 1 ][1] ) && this.coverage >= this.levels[i][1] );

            if ( this.levels[i][0].isEnabled( false ) === true ) {

                this.#isVisible = true;
                this.#lastLevel = i;
            }
        }
    }

}