"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class LOD extends AbstractLOD {

    #doShadow = false;
    
    /* override */ constructor( game, size, doShadow = false ) {

        super( game, size );

        this.#doShadow = doShadow;
    }

    get root() {

        return this.levels[0][0];
    }

    get position() {
        
        return this.root.position;
    }

    get rotationQuaternion() {
        
        return this.root.rotationQuaternion;
    }

    get scaling() {
        
        return this.root.scaling;
    }
    
    set parent( value ) {

        for ( let i = 0; i < this.levels.length; i++ ) {

            this.levels[i][0].parent = value;
        }
    }

    fromSingle( node ) {

        this.add( node, AbstractLOD.minimum );
    }

    fromModels( models, onEveryMesh ) {
        
        for ( let i = 0; i < models.length; i++ ) {
            
            this.add( this.game.scene.assets.instance( models[i], mesh => onEveryMesh( mesh, i ) ), Number( models[i].name.split( "_" )[2] ) );
        }
    }

    /* override */ add( node, min ) {

        if ( this.levels.length > 0 ) {

            node.position = this.position;
            node.rotationQuaternion = this.rotationQuaternion;
            node.scaling = this.scaling;

        } else if ( !node.rotationQuaternion ) {
            
            node.rotationQuaternion = node.rotation.toQuaternion();
        }

        node.setEnabled( false );

        super.add( node, min );
    }

    /* override */ disposeCurrent( currentLevel ) {

        if ( currentLevel !== undefined ) {

            this.levels[ currentLevel ][0].setEnabled( false );
            
            if ( this.#doShadow === true ) {

                this.game.star.shadow.cast( this.levels[ currentLevel ][0], false /*, undefined, false*/ );        
            }

            super.disposeCurrent( currentLevel );
        }
    }

    /* override */ makeCurrent( level ) {

        if ( level >= 0 && level < this.levels.length ) {

            super.makeCurrent( level );
            
            if ( this.#doShadow === true && level === 0 ) {
                
                this.game.star.shadow.cast( this.levels[ level ][0] /*, undefined, undefined, false*/ );        
            }

            this.levels[ level ][0].setEnabled( true );
        }
    }

}