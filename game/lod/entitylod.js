"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EntityLOD extends AbstractLOD {

    position = new BABYLON.Vector3();
    rotationQuaternion = new BABYLON.Quaternion();
    scaling = BABYLON.Vector3.One();
    parent = null;

    #doShadow = undefined;
    #doCollidable = false;
    #onRequest = undefined;
    #onReturn = undefined;

    #currentEntity = null;

    /* override */ constructor( game, doShadow = undefined, doCollidable = false, onRequest = undefined, onReturn = undefined ) {

        super( game );

        this.#doShadow = doShadow;
        this.#doCollidable = doCollidable;
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

    getInstance() {

        if ( this.#currentEntity !== null ) {

            return this.#currentEntity;
        }
    }

    /* override */ disposeCurrent( currentLevel ) {

        if ( currentLevel !== undefined ) {

            this.#onReturn?.( this.#currentEntity );

            if ( this.#doCollidable === true ) {

                PhysicsEntity.collidable( this.#currentEntity, undefined, false );
            }

            this.#doShadow?.( this.#currentEntity, false );

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

            if ( level === 0 ) {
                
                if ( this.#doCollidable === true ) {
    
                    PhysicsEntity.collidable( this.#currentEntity );
                }

                this.#doShadow?.( this.#currentEntity, true );     
            }

            this.#onRequest?.( this.#currentEntity );
        }
    }

}