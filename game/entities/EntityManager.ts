/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface Object {

    entitymanager?: IEntityManager< any >;

}

class EntityManager< T extends BABYLON.AbstractMesh > implements IEntityManager< T > {

    private readonly free: ISmartObjectArray< T >;
    private readonly used: ISmartObjectArray< T >;

    private readonly create: () => T;
    private readonly increase: number;

    private root: BABYLON.Node;

    public constructor( name: string, create: () => T, size: number, increase: number ) {
        
        this.increase = increase;
        this.create = create;

        this.free = new SmartObjectArray< T >( size );
        this.used = new SmartObjectArray< T >( size );

        this.createRoot( name );
        this.make( size );
    }

    public request(): T | null {

        if ( this.free.size === 0 ) {

            this.make( this.increase );
        }

        return this.release( this.free.pop() || ( (): undefined => { console.warn( "EntityManager: Request malfunctioned." ); return undefined; } )() );
    }

    public return( entity: T ): null {

        this.used.delete( entity );
        return this.store( entity );
    }

    private createRoot( name: string ): void {

        this.root = new BABYLON.Node( `entitymanager_${ name }`, scene );
        this.root.setEnabled( false );
    }

    private make( amount: number ): void {

        for ( let i: number = 0; i < amount; i++ ) {

            this.store( this.create() );
        }
    }

    private release( entity: T | undefined ): T | null {
        
        if ( entity !== undefined ) {

            this.used.add( entity );
            scene.addMesh( entity );

            entity.parent = null;
            entity.setEnabled( true );

            return entity;
        }
        
        return null;
    }

    private store( entity: T ): null {

        entity.setEnabled( false );
        entity.parent = this.root;

        scene.removeMesh( entity );
        this.free.add( entity );

        return null;
    }
    
}