/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface Object {

    collisionMesh: BABYLON.Mesh | BABYLON.InstancedMesh;

    isCollisionMesh: boolean;

}

class EngineAssets implements IEngineAssets {
    
    private static collisionKey: string = "COLLISION";
    private static collisionColor: string = "#43ff53";

    public readonly game: IGame;
    public readonly scene: BABYLON.Scene;
    public cache: BABYLON.Node;

    public readonly list: Map< ILoadConfig[ "key" ], BABYLON.TransformNode > = new Map< ILoadConfig[ "key" ], BABYLON.TransformNode >();
    public readonly materials: Map< string, BABYLON.StandardMaterial > = new Map< string, BABYLON.StandardMaterial >();
    public readonly interactableMaterials: Map< string, IPlayerInteractionMaterial > = new Map< string, IPlayerInteractionMaterial >();
    public readonly onLoadObservable: BABYLON.Observable< void > = new BABYLON.Observable< void >();

    private notify: boolean = false;
    private fallbackMaterial: BABYLON.StandardMaterial;

    public constructor( game: IGame ) {
        
        this.game = game;
        this.scene = this.game.scene;
        
        this.createCache();
        this.createFallbackMaterial();
        this.listen();
    }
    
    public load( list: ILoadConfig[] ): void {
        
        const sync: ISync = new Sync( list.length, () => this.notify = true );

        for ( let i: number = 0; i < list.length; i++ ) {

            if ( this.list.has( list[i].key ) === true ) {

                console.warn( `EngineAssets: ${ list[i].key } already loaded.` );
            }

            BABYLON.SceneLoader.LoadAssetContainer( "", list[i].path, this.scene, ( container: BABYLON.AssetContainer ) => {
                
                const asset: BABYLON.TransformNode = container.transformNodes.filter( ( transformNode: BABYLON.TransformNode ) => ( transformNode.id === list[i].key || transformNode.name === list[i].key ) )[0] || null;

                this.list.set( list[i].key, asset );
                sync.next();
            } );
        }
    }

    public traverse( importLod: BABYLON.Mesh, onEveryMesh: ( mesh: BABYLON.Mesh ) => void, interactables: string[] = [] ): BABYLON.Mesh {
        
        const lod: BABYLON.Mesh = this.traverseMesh( importLod, onEveryMesh, interactables );
        const subs: BABYLON.Mesh[] = importLod.getChildMeshes( true );
        
        for ( let i: number = 0; i < subs.length; i++ ) {

            if ( subs[i].name.includes( EngineAssets.collisionKey ) === true || subs[i].id.includes( EngineAssets.collisionKey ) ) {

                lod.collisionMesh = this.traverseCollisionMesh( subs[i] );
                lod.collisionMesh.parent = lod;

            } else {

                this.traverseMesh( subs[i], onEveryMesh, interactables ).parent = lod;
            }
        }

        lod.parent = this.cache;
        lod.setEnabled( false );

        return lod;
    }

    public merge( mesh: BABYLON.Mesh ): BABYLON.Mesh {

        const meshes: BABYLON.Mesh[] = [ mesh ];
        const subs: BABYLON.Mesh[] = mesh.getChildMeshes( true );
        const collisionMeshes: BABYLON.Mesh[] = [];

        for ( let i: number = 0; i < subs.length; i++ ) {

            const list: BABYLON.Mesh[] = subs[i].isCollisionMesh === true ? collisionMeshes : meshes;
            list.push( subs[i] );
        }

        const result: BABYLON.Mesh | null = BABYLON.Mesh.MergeMeshes( meshes, false, undefined, undefined, undefined, true );

        if ( result instanceof BABYLON.Mesh ) {

            for ( let i: number = 0; i < collisionMeshes.length; i++ ) {

                collisionMeshes[i].clone( collisionMeshes[i].name ).parent = result;
            }

            result.isPickable = false;
            result.parent = this.cache;
            result.setEnabled( false );

            return result;
        }
        
        return mesh;
    }

    public instance( lod: BABYLON.Mesh, onEveryInstance?: ( instance: BABYLON.InstancedMesh ) => void ): BABYLON.InstancedMesh {

        const instance: BABYLON.InstancedMesh = this.instanceMesh( lod, onEveryInstance );
        const subs: BABYLON.Mesh[] = lod.getChildMeshes( true );

        for ( let i: number = 0; i < subs.length; i++ ) {

            if ( subs[i].isCollisionMesh === true ) {

                instance.collisionMesh = this.instanceCollisionMesh( subs[i] );
                instance.collisionMesh.parent = instance;

            } else {

                this.instanceMesh( subs[i], onEveryInstance ).parent = instance;
            }
        }

        instance.parent = null;
        instance.setEnabled( true );

        return instance;
    }

    private createCache(): void {

        this.cache = new BABYLON.Node( "EngineAssets_cache", this.scene );
        this.cache.setEnabled( false );
    }

    private createFallbackMaterial(): void {

        this.fallbackMaterial = this.makeMaterial( "#FFFFFF", false );
    }

    private listen(): void {

        const id: number = setInterval( () => {

            if ( this.notify === true ) {

                clearInterval( id );
                this.onLoadObservable.notifyObservers();
            }
        }, 100 );
    }

    private traverseMesh( importMesh: BABYLON.Mesh, onMesh?: ( mesh: BABYLON.Mesh ) => void, interactables: string[] = [] ): BABYLON.Mesh {
        
        const interactable: boolean = interactables.includes( importMesh.name );
        const mesh: BABYLON.Mesh = this.traverseMeshGeneral( importMesh, undefined, interactable );

        if ( interactable === true ) {

            EngineUtilsShader.registerInstanceAttribute( mesh, "interactable", 0 );
        }

        onMesh?.( mesh );
        
        return mesh;
    }

    private traverseCollisionMesh( importCollisionMesh: BABYLON.Mesh ): BABYLON.Mesh {

        const mesh: BABYLON.Mesh = this.traverseMeshGeneral( importCollisionMesh, EngineAssets.collisionColor, false );

        mesh.isCollisionMesh = true;
        
        return mesh;
    }

    private traverseMeshGeneral( importMesh: BABYLON.Mesh, color?: string, interactable: boolean = false ): BABYLON.Mesh {

        const mesh: BABYLON.Mesh = new BABYLON.Mesh( importMesh.name, this.scene );
        
        mesh.isPickable = false;
        mesh.material = this.getColorMaterial( importMesh, color, interactable );
        
        if ( importMesh.geometry instanceof BABYLON.Geometry ) {

            importMesh.geometry.applyToMesh( mesh );
            mesh.flipFaces( true );
        }
        
        mesh.position.copyFrom( importMesh.position );
        mesh.rotation.copyFrom( importMesh.rotation );
        mesh.scaling.copyFrom( importMesh.scaling );

        if ( !mesh.rotationQuaternion ) {
            
            mesh.rotationQuaternion = mesh.rotation.toQuaternion();
        }

        return mesh;
    }

    private getColorMaterial( importMesh: BABYLON.Mesh, color?: string, interactable: boolean = false ): BABYLON.StandardMaterial {

        if ( color === undefined ) {
            
            if ( importMesh.material instanceof BABYLON.PBRMaterial ) {

                color = importMesh.material.albedoColor.toHexString();
        
            } else {

                color = this.fallbackMaterial.diffuseColor.toHexString()
            }
        }

        const materialList: Map< string, BABYLON.StandardMaterial > = interactable === false ? this.materials : this.interactableMaterials;

        if ( materialList.has( color ) === false ) {
                
            const material: BABYLON.StandardMaterial = this.makeMaterial( color, interactable );
            EngineExtensions.setStandardMaterialColorIntensity( material, color, 0.5 );
            
            if ( importMesh.material instanceof BABYLON.Material ) {
                
                material.alpha = importMesh.material.alpha;                
            }

            if ( color === EngineAssets.collisionColor ) {

                material.alpha = 0.25;
                BABYLON.Color3.FromHexString( EngineAssets.collisionColor ).scaleToRef( material.alpha, material.emissiveColor );
            }

            materialList.set( color, material );

            return material;

        } else {
            
            return materialList.get( color ) ||  this.fallbackMaterial;
        }
    }

    private makeMaterial( color: string, interactable: boolean ): BABYLON.StandardMaterial {

        const name: string = `c-${ color }`;

        if ( interactable === false ) {

            const material: BABYLON.StandardMaterial = new BABYLON.StandardMaterial( name, this.scene );
            material.freeze();

            return material;

        } else {

            const material: IPlayerInteractionMaterial = new PlayerInteractionMaterial( name, this.game );

            return material;
        }
    }

    private instanceMesh( mesh: BABYLON.Mesh, onInstance?: ( instance: BABYLON.InstancedMesh ) => void ): BABYLON.InstancedMesh {

        const instance: BABYLON.InstancedMesh = mesh.createInstance( `i-${ mesh.name }` );
        instance.isPickable = false;

        if ( !instance.rotationQuaternion ) {
            
            instance.rotationQuaternion = instance.rotation.toQuaternion();
        }

        onInstance?.( instance );

        return instance;
    }

    private instanceCollisionMesh( mesh: BABYLON.Mesh ): BABYLON.InstancedMesh {

        const instance: BABYLON.InstancedMesh = mesh.createInstance( `i-${ mesh.name }` );
        instance.isPickable = false;

        if ( !instance.rotationQuaternion ) {
            
            instance.rotationQuaternion = instance.rotation.toQuaternion();
        }

        instance.isCollisionMesh = true;
        instance.isVisible = false;
        
        return instance;
    }

}