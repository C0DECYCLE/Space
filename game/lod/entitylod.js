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
    #onRequest = undefined;
    #onReturn = undefined;

    #currentEntity = null;

    /* override */ constructor( game, doCollidable = false, doShadow = false, onRequest = undefined, onReturn = undefined ) {

        super( game );

        this.#doCollidable = doCollidable;
        this.#doShadow = doShadow;
        this.#onRequest = onRequest;
        this.#onReturn = onReturn;
    }

    fromModels( models ) {

        for ( let i = 0; i < models.length; i++ ) {
            
            this.add( models[i].entitymanager, AbstractLOD.getMinimum( models[i].name ) );
        }
    }

    setBounding( boundingCache ) {

        this.boundingCache = boundingCache;
    }

    /* override */ disposeCurrent( currentLevel ) {

        if ( currentLevel !== undefined ) {

            this.#onReturn?.( this.#currentEntity );

            if ( this.#doCollidable === true ) {

                PhysicsEntity.collidable( this.#currentEntity, undefined, false );
            }

            if ( this.#doShadow === true ) {

                this.game.star.shadow.cast( this.#currentEntity, false );        
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

                this.game.star.shadow.cast( this.#currentEntity );        
            }

            this.#onRequest?.( this.#currentEntity );
        }
    }

}