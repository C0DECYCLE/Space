"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ThemeKit {
    
    constructor( theme=false ) {
        
        
        this.force = theme ? true : false;
        
        this.current = this.force ? theme : "light";
    
        
        try {
            
            if ( this.force == false ) {
                
                this.current = window.matchMedia( "(prefers-color-scheme: dark)" ).matches ? "dark" : "light";
            }
                
            window.Keyboard.setKeyboardStyle( this.current );
            
        } catch(e) {}
        
    }

    
    switch( light, dark ) { //Return a Value based on the theme
        
        if ( this.current == "dark" ) {
            
            return dark;
            
        } else {
            
            return light;
        }
    }
    
    sandbox( theme="light" ) { //Sandbox debug mode which u can test an language
        
        this.force = true;
        this.current = theme;
    }
    
}