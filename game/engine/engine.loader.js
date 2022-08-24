"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EngineLoader {

    #engine = null;

    constructor( engine ) {

        this.#engine = engine;
    }

    load( scene, list, callback ) {

        const result = new Map();
        const sync = new Sync( list.length, () => callback( result ) );

        for ( let i = 0; i < list.length; i++ ) {

            BABYLON.SceneLoader.LoadAssetContainer( "", list[i].path, scene, container => {
                
                result.set( list[i].key, container.transformNodes.getByProperty( "id", list[i].key ) || container.transformNodes.getByProperty( "name", list[i].key ) );
                sync.next();
            } );
        }
    }

    traverse(  ) {


    }

}