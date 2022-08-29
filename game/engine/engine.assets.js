"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EngineAssets {
    
    scene = null;

    list = new Map();
    materials = new Map();
    onLoadObservable = new BABYLON.Observable();

    #notify = false;

    constructor( scene ) {
        
        this.scene = scene;
    }
    
    load( list ) {
        
        const sync = new Sync( list.length, () => this.#notify = true );

        for ( let i = 0; i < list.length; i++ ) {

            if ( this.list.has( list[i].key ) === true ) {

                console.warn( `EngineAssets: ${ list[i].key } already loaded.` );
            }

            BABYLON.SceneLoader.LoadAssetContainer( "", list[i].path, this.scene, container => {
                
                const asset = container.transformNodes.getByProperty( "id", list[i].key ) || 
                              container.transformNodes.getByProperty( "name", list[i].key );

                this.list.set( list[i].key, asset );
                sync.next();
            } );
        }
    }

    traverse( importLod, onEveryMesh ) {

        const lod = this.#traverseMesh( importLod, onEveryMesh );
        const subs = importLod.getChildMeshes( true );
        
        for ( let i = 0; i < subs.length; i++ ) {

            this.#traverseMesh( subs[i], onEveryMesh ).parent = lod;
        }

        return lod;
    }

    instance( lod, onEveryInstance ) {

        const instance = this.#instanceMesh( lod, onEveryInstance );
        const subs = lod.getChildMeshes( true );

        for ( let i = 0; i < subs.length; i++ ) {

            this.#instanceMesh( subs[i], onEveryInstance ).parent = instance;
        }

        return instance;
    }
    
    update() {

        if ( this.#notify === true ) {

            this.#notify = false;
            this.onLoadObservable.notifyObservers();
        }
    }

    #traverseMesh( importMesh, onMesh = undefined ) {
        
        const mesh = new BABYLON.Mesh( importMesh.name, this.scene );
        const color = importMesh.material.albedoColor.toHexString();
        
        if ( this.materials.has( color ) === false ) {
                
            const material = new BABYLON.StandardMaterial( `Color_${ color }`, this.scene );
            material.setColorIntensity( color, 0.5 );
            material.alpha = importMesh.material.alpha;
            this.materials.set( color, material );
        }
        
        mesh.material = this.materials.get( color );
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

    #instanceMesh( mesh, onInstance = undefined ) {

        const instance = mesh.createInstance( `${ mesh.name }_instance` );

        if ( typeof onInstance === "function" ) {

            onInstance( instance );
        }
        return instance;
    }

}