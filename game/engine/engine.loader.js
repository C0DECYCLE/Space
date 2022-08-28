"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EngineLoader {

    assets = new Map();
    materials = new Map();

    #engine = null;

    constructor( engine ) {

        this.#engine = engine;
    }

    load( list, callback, scene ) {

        if ( scene.assets === undefined ) {

            scene.assets = new Map();
        }
        
        const result = new Map();
        const sync = new Sync( list.length, () => callback( result ) );

        for ( let i = 0; i < list.length; i++ ) {

            if ( scene.assets.has( list[i].key ) === true ) {

                console.warn( `EngineLoader: ${ list[i].key } already loaded.` );
            }

            BABYLON.SceneLoader.LoadAssetContainer( "", list[i].path, scene, container => {
                
                const asset = container.transformNodes.getByProperty( "id", list[i].key ) || 
                              container.transformNodes.getByProperty( "name", list[i].key );

                result.set( list[i].key, asset );
                scene.assets.set( list[i].key, asset );

                sync.next();
            } );
        }
    }

    traverse( importLod, onEveryMesh, scene, context ) {

        const lod = context.traverseMesh( importLod, onEveryMesh, scene, context );
        const subs = importLod.getChildMeshes( true );
        
        for ( let i = 0; i < subs.length; i++ ) {

            context.traverseMesh( subs[i], onEveryMesh, scene, context ).parent = lod;
        }

        return lod;
    }

    instance( lod, onEveryInstance, context ) {

        const instance = context.instanceMesh( lod, onEveryInstance );
        const subs = lod.getChildMeshes( true );

        for ( let i = 0; i < subs.length; i++ ) {

            context.instanceMesh( subs[i], onEveryInstance ).parent = instance;
        }

        return instance;
    }

    traverseMesh( importMesh, onMesh = undefined, scene, context ) {
        
        const mesh = new BABYLON.Mesh( importMesh.name, scene );
        const color = importMesh.material.albedoColor.toHexString();
        
        if ( context.materials.has( color ) === false ) {
                
            const material = new BABYLON.StandardMaterial( `Color_${ color }`, scene );
            material.setColorIntensity( color, 0.5 );
            material.alpha = importMesh.material.alpha;
            context.materials.set( color, material );
        }
        
        mesh.material = context.materials.get( color );
        importMesh.geometry.applyToMesh( mesh );
        mesh.flipFaces( true );
        
        mesh.position.copyFrom( importMesh.position );
        mesh.rotation.copyFrom( importMesh.rotation );
        mesh.scaling.copyFrom( importMesh.scaling );
        
        if ( typeof onMesh === "function" ) {

            onMesh( mesh );
        }
        return mesh;
    }

    instanceMesh( mesh, onInstance = undefined ) {

        const instance = mesh.createInstance( `${ mesh.name }_instance` );

        if ( typeof onInstance === "function" ) {

            onInstance( instance );
        }
        return instance;
    }
}