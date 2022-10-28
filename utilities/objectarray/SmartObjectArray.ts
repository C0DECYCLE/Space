/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class SmartObjectArray< T extends object > extends ObjectArray< T > implements ISmartObjectArray< T > {

    private static readonly default: any = 0;

    public get size(): number {

        return this.capacity;
    }
    
    private capacity: number = 0;

    public constructor( capacity: number ) {
    
        super( capacity );
        this.flood();
    }

    public override push( ...elements: T[] ): number {
            
        this[ this.capacity ] = this.initialize( elements[0], this.capacity++ );

        if ( this.capacity === this.length ) {

            this.length *= 2;
            this.flood( this.capacity );
        }

        return this.capacity;
    }

    public override pop(): T | undefined {
        
        if ( this.capacity > 0 ) {

            const object: T = this[ --this.capacity ];
            this.decommission( object );
            this.clean( this.capacity );

            return object;
        }

        return undefined;
    }

    public override clear(): void {
        
        let i: number;

        for ( i = 0; i < this.capacity; i++ ) {

            this.decommission( this[i] );
            this.clean( i );
        }

        this.capacity = 0;
    }

    public override delete( element: T ): void {
        
        super.delete( element, this.capacity );
    }

    private flood( start: number = 0, end: number = this.length ): void {

        let i: number;

        for ( i = start; i < end; i++ ) {

            this.clean(i);
        }
    }

    private clean( index: number ): void {

        this[ index ] = SmartObjectArray.default;
    }

}