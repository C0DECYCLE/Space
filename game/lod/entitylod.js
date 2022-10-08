"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EntityLOD extends AbstractLOD {

    position = new BABYLON.Vector3();
    rotationQuaternion = new BABYLON.Quaternion();
    scaling = new BABYLON.Vector3();
    parent = null;

    #doCollidable = false;
    #doShadow = false;
    #currentEntity = null;

    /* override */ constructor( game, size, doCollidable = false, doShadow = false ) {

        super( game, size );

        this.#doCollidable = doCollidable;
        this.#doShadow = doShadow;
    }

    /* override */ disposeCurrent( currentLevel ) {

        if ( currentLevel !== undefined ) {

            if ( this.#doCollidable === true ) {

                PhysicsEntity.collidable( this.#currentEntity, undefined, false );
            }

            if ( this.#doShadow === true ) {

                this.game.star.shadow.cast( this.#currentEntity, false /*, undefined, false*/ );        
            }

            this.#currentEntity = this.levels[ currentLevel ][0].return( this.#currentEntity );
            super.disposeCurrent( currentLevel );
        }
    }

    /* override */ makeCurrent( level ) {

        if ( level >= 0 && level < this.levels.length ) {

            super.makeCurrent( level );
            this.#currentEntity = this.levels[ level ][0].request();

            this.#currentEntity.position.copyFrom( this.position );
            this.#currentEntity.rotationQuaternion.copyFrom( this.rotationQuaternion );
            this.#currentEntity.scaling.copyFrom( this.scaling );
            this.#currentEntity.parent = this.parent;
    
            if ( this.#doCollidable === true && level === 0 ) {
    
                PhysicsEntity.collidable( this.#currentEntity );
            }

            if ( this.#doShadow === true && level === 0 ) {

                this.game.star.shadow.cast( this.#currentEntity /*, undefined, undefined, false*/ );        
            }
        }
    }

}