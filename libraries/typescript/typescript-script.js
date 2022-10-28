"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

( function () {

    function fetchConfig() {

        fetch( "/tsconfig.json" ).then( response => response.json() ).then( onConfigLoaded );
    }
    
    const transpileWorker = window.URL.createObjectURL( new Blob( [ `

        const load = sourceUrl => {

            const xhr = XMLHttpRequest ? new XMLHttpRequest() : ActiveXObject ? new ActiveXObject( "Microsoft.XMLHTTP" ) : null;

            if ( !xhr ) return "";

            xhr.open( "GET", sourceUrl, false );
            xhr.overrideMimeType && xhr.overrideMimeType( "text/plain" );
            xhr.send( null );

            return xhr.status == 200 ? xhr.responseText : "";
        };

        onmessage = ( { data: [ sourceUrl, sourceCode, tsconfig, tspath ] } ) => {

          importScripts( tspath );

          const raw = sourceCode ? sourceCode : load( sourceUrl );

          postMessage( ts.transpile( raw, tsconfig.compilerOptions ) );
        };

    ` ], { type: "text/javascript" } ) );

    async function onConfigLoaded( tsconfig ) {

        const scripts = document.getElementsByTagName( "script" );
        const pending = [];
        const transpilations = [];

        let j = 0;

        for ( let i = 0; i < scripts.length; i++ ) {

            if ( scripts[i].type === "text/typescript" ) {

                const { src } = scripts[i];
                const innerHTML = src ? null : scripts[i].innerHTML;
                const index = j++;

                pending.push( new Promise( resolve => {
                
                    const w = new Worker( transpileWorker );

                    w.postMessage( [ src, innerHTML, tsconfig, `${ document.location }libraries/typescript/typescript.4.8.4.js` ] );
                    w.onmessage = ( { data: transpiled } ) => {

                        transpilations[ index ] = [ transpiled, scripts[i] ];

                        w.terminate();
                        resolve();
                    };
                } ) );
            }
        }

        function onError( error ) {

            error.preventDefault();

            console.error(error);
        }

        await Promise.all( pending );
        
        window.addEventListener( "error", onError);
        
        for ( let i = 0; i < transpilations.length; i++ ) {

            const newScript = document.createElement( "script" );
            newScript.innerHTML = transpilations[i][0];

            transpilations[i][1].replaceWith( newScript );
        }

        console.log( "[Typescript]: TRANSPILED" );
        
        window.removeEventListener( "error", onError);
    }

    window.addEventListener( "DOMContentLoaded", fetchConfig );
    
} )();