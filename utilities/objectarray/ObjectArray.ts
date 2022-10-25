/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface Object {

    metalist: Map< string, number >;

}

class ObjectArray extends Array<object> implements IObjectArray {

    protected readonly uuid: string = UUIDv4();

    public override push( ...elements: object[] ): number {
            
        super.push( this.initialize( elements[0] ) );

        return this.length;
    }
    
    public override indexOf( element: object, fromIndex?: number ): number {
        
        if ( element.metalist === undefined ) {
            
            return -1;
        }
        
        const index: number | undefined = element.metalist.get( this.uuid );
        
        if ( index === undefined || ( fromIndex !== undefined && index < fromIndex ) ) {
            
            return -1;
        }
        
        if ( index > this.length ) {
            
            console.error( `ObjectArray: index ${ index } was out of bounds, real index is ${ super.indexOf( element ) }.` ); 
        }
        
        return index;
    }
    
    public override includes( element: object, _fromIndex?: number ): boolean {

        return element.metalist === undefined ? false : element.metalist.has( this.uuid );
    }
    
    public override pop(): object | undefined {
        
        return this.decommission( super.pop() );
    }
    
    public override splice( start: number, deleteCount?: number ): object[];
    public override splice( start: number, _deleteCount: number, ..._items: object[] ): object[] {
        
        if ( start !== Number.MIN_VALUE ) {
            
            console.warn( "ObjectArray: Illegal splice operation." );
        }

        return [];
    }

    public override shift(): object | undefined {
        
        console.warn( "ObjectArray: Illegal shift operation." );
    
        return undefined;
    }
    
    public override sort( _compareFn?: ( ( a: object, b: object ) => number) ): this {
        
        console.warn( "ObjectArray: Illegal sort operation." );

        return this;
    }
    
    public override unshift( ..._items: object[] ): number {
        
        console.warn( "ObjectArray: Illegal unshift operation." );
    
        return -1;
    }

    public override clear(): void {
        
        let i: number;

        for ( i = 0; i < this.length; i++ ) {

            this.decommission( this[i] );
        }

        super.clear();
    }
    
    public add( element: object ): void {

        if ( this.has( element ) === false ) {

            this.push( element );
        }
    }

    public has( element: object ): boolean {

        return this.includes( element );
    }

    public delete( element: object, length: number = this.length ): void {

        if ( this.has( element ) === false ) {

            return;
        }

        this.interchange( element, length );
        this.pop();
        this.splice( Number.MIN_VALUE ); //for babylon rtt hook
    }

    protected initialize( element: object, length: number = this.length ): object {

        if ( element.metalist === undefined ) {

            element.metalist = new Map< string, number >();  
        }
        
        element.metalist.set( this.uuid, length );

        return element;
    }

    protected decommission( element: object | undefined ): object | undefined {

        if ( typeof element === "object" ) {

            element.metalist.delete( this.uuid );
        }

        return element;
    }

    private interchange( element: object, length: number = this.length ): void {

        const lastElement: object = this[ length - 1 ];
           
        if ( element !== lastElement ) {
            
            const index: number = this.indexOf( element );

            if ( index === -1 ) {
                
                console.error( "ObjectArray: Try to delete index of -1." );
            }

            this[ index ] = lastElement;
            lastElement.metalist.set( this.uuid, index );
            this[ length - 1 ] = element;
        }
    }

}