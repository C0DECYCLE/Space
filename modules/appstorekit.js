"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AppStoreKit {
    
    static _getJSONP( url, success ) {

        var ud = `_${ new Date }`,
            script = document.createElement( "script" ),
            head = document.getElementsByTagName( "head" )[0] || document.documentElement;

        window[ ud ] = function( data ) {
            head.removeChild( script );
            success && success( data );
        };

        script.src = url.replace( "callback=?", `callback=${ ud }` );
        script.type = "application/json";
        head.appendChild( script );
    }
    
    static getVersion( bundleId, success ) {
        
        AppStoreKit._getJSONP( `http://itunes.apple.com/lookup?bundleId=${ bundleId }&callback=?`, function( data ) {
            
            if ( data.resultCount > 0 ) {
                
                success( data.results[0].version ); console.log( data.results[0] );
            }
        } );  
    }
    
    static checkUpdate( bundleId, localVersion, success ) {
    
        AppStoreKit.getVersion( bundleId, ( publicVersion ) => {
            
            if ( localVersion == publicVersion ) { //up-to-date
                
                success( false );
                
            } else { //need-to-update
                
                success( true );
            }
        } );
    }
    
}