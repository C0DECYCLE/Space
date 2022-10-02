"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EngineAssets {
    
    static collisionKey = "COLLISION";
    static collisionColor = "#43ff53";

    game = null;
    scene = null;
    cache = null;

    list = new Map();
    materials = new Map();
    interactableMaterials = new Map();
    onLoadObservable = new BABYLON.Observable();

    #notify = false;

    constructor( game ) {
        
        this.game = game;
        this.scene = this.game.scene;

        this.#createCache();
        this.#listen();
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

    traverse( importLod, onEveryMesh, interactables = [] ) {
        
        const lod = this.#traverseMesh( importLod, onEveryMesh, interactables );
        const subs = importLod.getChildMeshes( true );
        
        for ( let i = 0; i < subs.length; i++ ) {

            if ( subs[i].name.includes( EngineAssets.collisionKey ) === true || subs[i].id.includes( EngineAssets.collisionKey ) ) {

                lod.collisionMesh = this.#traverseCollisionMesh( subs[i] );
                lod.collisionMesh.parent = lod;

            } else {

                this.#traverseMesh( subs[i], onEveryMesh, interactables ).parent = lod;
            }
        }

        lod.parent = this.cache;
        lod.setEnabled( false );

        return lod;
    }

    merge( mesh ) {

        const meshes = [ mesh ];
        const subs = mesh.getChildMeshes( true );
        const collisionMeshes = [];

        for ( let i = 0; i < subs.length; i++ ) {

            const list = subs[i].isCollisionMesh === true ? collisionMeshes : meshes;
            list.push( subs[i] );
        }

        const result = BABYLON.Mesh.MergeMeshes( meshes, false, undefined, undefined, undefined, true );

        for ( let i = 0; i < collisionMeshes.length; i++ ) {

            collisionMeshes[i].clone( collisionMeshes[i].name ).parent = result;
        }

        result.parent = this.cache;
        result.setEnabled( false );

        return result;
    }

    instance( lod, onEveryInstance ) {

        const instance = this.#instanceMesh( lod, onEveryInstance );
        const subs = lod.getChildMeshes( true );

        for ( let i = 0; i < subs.length; i++ ) {

            if ( subs[i].isCollisionMesh === true ) {

                instance.collisionMesh = this.#instanceCollisionMesh( subs[i], onEveryInstance );
                instance.collisionMesh.parent = instance;

            } else {

                this.#instanceMesh( subs[i], onEveryInstance ).parent = instance;
            }
        }

        instance.parent = null;
        instance.setEnabled( true );

        return instance;
    }

    #createCache() {

        this.cache = new BABYLON.Node( "EngineAssets_cache", this.scene );
        this.cache.setEnabled( false );
    }

    #listen() {

        const id = setInterval( () => {

            if ( this.#notify === true ) {

                clearInterval( id );
                this.onLoadObservable.notifyObservers();
            }
        }, 100 );
    }

    #traverseMesh( importMesh, onMesh = undefined, interactables = [] ) {
        
        const interactable = interactables.includes( importMesh.name );
        const mesh = this.#traverseMeshGeneral( importMesh, undefined, interactable );

        if ( interactable === true ) {

            EngineUtilsShader.registerInstanceAttribute( mesh, "interactable", 0 );
        }

        onMesh?.( mesh );
        
        return mesh;
    }

    #traverseCollisionMesh( importCollisionMesh ) {

        const mesh = this.#traverseMeshGeneral( importCollisionMesh, EngineAssets.collisionColor, false );

        mesh.isCollisionMesh = true;
        
        return mesh;
    }

    #traverseMeshGeneral( importMesh, color = undefined, interactable = false ) {

        const mesh = new BABYLON.Mesh( importMesh.name, this.scene );
        
        mesh.material = this.#getColorMaterial( importMesh, color, interactable );
        importMesh.geometry.applyToMesh( mesh );
        mesh.flipFaces( true );
        
        mesh.position.copyFrom( importMesh.position );
        mesh.rotation.copyFrom( importMesh.rotation );
        mesh.scaling.copyFrom( importMesh.scaling );

        return mesh;
    }

    #getColorMaterial( importMesh, color = undefined, interactable = false ) {

        color = color === undefined ? importMesh.material.albedoColor.toHexString() : color;
        const materialList = interactable === false ? this.materials : this.interactableMaterials;

        if ( materialList.has( color ) === false ) {
                
            const material = this.#makeMaterial( color, interactable );
            material.setColorIntensity( color, 0.5 );
            material.alpha = importMesh.material.alpha;

            if ( color === EngineAssets.collisionColor ) {

                material.alpha = 0.25;
                BABYLON.Color3.FromHexString( EngineAssets.collisionColor ).scaleToRef( material.alph, material.emissiveColor );
            }

            materialList.set( color, material );
        }
        
        return materialList.get( color );
    }

    #makeMaterial( color, interactable ) {

        const name = `c-${ color }`;

        if ( interactable === false ) {

            return new BABYLON.StandardMaterial( name, this.scene );

        } else {

            const material = new PlayerInteractionMaterial( name, this.game );

            return material;
        }
    }

    #instanceMesh( mesh, onInstance = undefined ) {

        const instance = mesh.createInstance( `i-${ mesh.name }` );

        onInstance?.( instance );

        return instance;
    }

    #instanceCollisionMesh( mesh ) {

        const instance = mesh.createInstance( `i-${ mesh.name }` );

        instance.isCollisionMesh = true;
        instance.isVisible = false;
        
        return instance;
    }

}