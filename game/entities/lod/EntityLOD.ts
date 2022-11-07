/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EntityLOD extends AbstractLOD implements IEntityLOD {

    public override readonly levels: [ IEntityManager< BABYLON.InstancedMesh >, number ][] = [];

    public readonly position: BABYLON.Vector3 = new BABYLON.Vector3();
    public readonly rotationQuaternion: BABYLON.Quaternion = new BABYLON.Quaternion();
    public readonly scaling: BABYLON.Vector3 = BABYLON.Vector3.One();

    public parent: BABYLON.Node | null = null;

    private readonly doShadow?: ( currentEntity: BABYLON.InstancedMesh, value: boolean ) => void;
    private readonly doCollidable: boolean = false;
    private readonly onRequest?: ( currentEntity: BABYLON.InstancedMesh ) => void;
    private readonly onReturn?: ( currentEntity: BABYLON.InstancedMesh ) => void;

    private currentEntity: BABYLON.InstancedMesh | null = null;

    public constructor( doShadow?: ( currentEntity: BABYLON.InstancedMesh, value: boolean ) => void, doCollidable: boolean = false, onRequest?: ( currentEntity: BABYLON.InstancedMesh ) => void, onReturn?: ( currentEntity: BABYLON.InstancedMesh ) => void ) {

        super();

        this.doShadow = doShadow;
        this.doCollidable = doCollidable;
        this.onRequest = onRequest;
        this.onReturn = onReturn;
    }

    public fromModels( models: IModels ): void {

        for ( let i: number = 0; i < models.length; i++ ) {
            
            this.add( models[i].entitymanager, AbstractLOD.getMinimum( models[i].name ) );
        }
    }

    public setBounding( boundingCache: IBoundingCache ): void {

        this.boundingCache = boundingCache;
    }

    public getInstance(): BABYLON.InstancedMesh | null {

        return this.currentEntity;
    }

    public update(): void {
        
        if ( this.isEnabled === false ) {

            return;
        }

        this.coverage = Camera.getInstance().getScreenCoverage( this );
        this.setLevel( this.getLevelFromCoverage( this.coverage ) );
    }

    protected override disposeCurrent( currentLevel: number ): void {

        if ( this.doCollidable === true && this.currentEntity instanceof BABYLON.AbstractMesh ) {

            PhysicsEntity.collidable( this.currentEntity, undefined, false );
        }

        if ( this.currentEntity !== null ) {
            
            this.onReturn?.( this.currentEntity );
            this.doShadow?.( this.currentEntity, false );

            this.currentEntity = this.levels[ currentLevel ][0].return( this.currentEntity );
        }

        this.currentEntity = null;

        super.disposeCurrent( currentLevel );
    }

    protected override makeCurrent( level: number ): void {

        if ( level >= 0 && level < this.levels.length ) {

            super.makeCurrent( level );

            const requestResult: BABYLON.InstancedMesh | null = this.levels[ level ][0].request();

            if ( requestResult instanceof BABYLON.InstancedMesh ) {

                this.currentEntity = requestResult;

                if ( this.currentEntity.rotationQuaternion === null ) {

                    this.currentEntity.rotationQuaternion = this.currentEntity.rotation.toQuaternion();
                }

                this.currentEntity.position.copyFrom( this.position );
                this.currentEntity.rotationQuaternion.copyFrom( this.rotationQuaternion );
                this.currentEntity.scaling.copyFrom( this.scaling );
                this.currentEntity.parent = this.parent;
    
                if ( level === 0 ) {
                    
                    if ( this.doCollidable === true ) {
        
                        PhysicsEntity.collidable( this.currentEntity );
                    }
    
                    this.doShadow?.( this.currentEntity, true );     
                }
    
                this.onRequest?.( this.currentEntity );
            }
        }
    }

}