"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class LanguageKit {
    
    constructor( onComplete ) {
    
        
        this.current = ( navigator.language.split("-")[0] == "de" ) ? "de" : "en"; //de, en, etc.
        
        this.dictionary = {};
        
        
        window.fetch( "assets/language.json" ).then( response => response.text() ).then( jsonWithComments => {

            
            let jsonPure = jsonWithComments.replace( /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m );

            this.dictionary = JSON.parse( jsonPure );

            onComplete();
            
        } );

    }
        
    
    get( index ) { //Get an String from the dictionary with the correct current language by the id nummer
        
        return this.dictionary[ this.current ][ index ];
    }
    
    sandbox( language ) { //Sandbox debug mode which u can test an language
        
        this.current = language;
    }
    
}