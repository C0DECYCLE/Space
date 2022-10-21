/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/


const log = console.log;

const PHI: number = ( 1 + 5 ** 0.5 ) / 2;



function UUIDv4(): string {

    return ( `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}` ).replace( /[018]/g, ( c: any ) => ( c ^ crypto.getRandomValues( new Uint8Array(1) )[0] & 15 >> c / 4 ).toString( 16 ) );
}



interface Number {
    
    between( a: number, b: number ): boolean;

    dotit(): string;

    clamp( min: number, max: number ): number;

}

Number.prototype.between = function( a: number, b: number ): boolean {

    return this.valueOf() > Math.min( a, b ) && this.valueOf() < Math.max( a, b );
};

Number.prototype.dotit = function(): string {

    return Math.round( this.valueOf() ).toString().replace( /(\d)(?=(\d{3})+(?!\d))/g, "$1," );
};

Number.prototype.clamp = function( min: number, max: number ): number {

    return Math.min( Math.max( this.valueOf(), min ), max );
};



interface String {
    
    firstLetterUppercase(): string;

    replaceAt( index: number, replacement: string ): string;

}

String.prototype.firstLetterUppercase = function(): string {

    return this.charAt( 0 ).toUpperCase() + this.slice( 1 );
};

String.prototype.replaceAt = function( index: number, replacement: string ): string {
    
    return this.substring( 0, index ) + replacement + this.substring( index + replacement.length );
}



interface Array<T> {
    
    clear(): void;

}

Array.prototype.clear = function(): void {

    this.length = 0;
};