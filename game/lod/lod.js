"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class LOD {

    static minimum = 0.01;

    levels = [];
    coverage = undefined;

    #manager = null;

    constructor( manager ) {

        this.#manager = manager;
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

        this.add( node, LOD.minimum );
    }

    fromModels( models, onEveryMesh ) {
        
        for ( let i = 0; i < models.length; i++ ) {
            
            this.add( this.#manager.scene.instance( models[i], onEveryMesh ), Number( models[i].name.split( "_" )[2] ) );
        }
    }

    add( node, min ) {

        if ( this.levels.length > 0 ) {

            node.position = this.position;
            node.rotationQuaternion = this.rotationQuaternion;
            node.scaling = this.scaling;

        } else if ( !node.rotationQuaternion ) {
            
            node.rotationQuaternion = node.rotation.toQuaternion();
        }

        this.levels.push( [ node, min.clamp( LOD.minimum, Infinity ) ] );
    }

    update() {
        
        this.coverage = this.#manager.camera.screenCoverage( this.root );

        for ( let i = 0; i < this.levels.length; i++ ) {

            this.levels[i][0].setEnabled( this.coverage < ( i - 1 < 0 ? Infinity : this.levels[ i - 1 ][1] ) && this.coverage >= this.levels[i][1] );
        }
    }

}