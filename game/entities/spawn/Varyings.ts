/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Varyings implements IVaryings {
    
    [ key: string ]: any;
    
    public constructor( ...args: [ string, any ][] ) {
        
        for ( let i: number = 0; i < args.length; i++ ) {

            this[ args[i][0] ] = args[i][1]; 
            
            args[i].clear();
        }

        args.clear();
    }

}