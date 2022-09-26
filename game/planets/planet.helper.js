"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetHelper {

    #planet = null;

    constructor( planet, faces ) {
    
        this.#planet = planet;

        this.#createFaces( faces );
        this.#createMask();
        this.toggleMask( false );
        //this.#debugInfluence();
    }

    toggleMask( value ) {

        this.#planet.mask.setEnabled( value );
    }

    createBasicMaterial() {
        
        const material = new BABYLON.StandardMaterial( `planet${ this.#planet.config.key }_basicMaterial`, this.#planet.scene );
        material.setColorIntensity( "#534d5f", 1.0 );
        material.wireframe = true;

        return material;
    }

    #createFaces( faces ) {

        const suffix = "UDFBLR";
        const rotations = [

            new BABYLON.Vector3( 0, 0, 0 ), //Up
            new BABYLON.Vector3( 2, 0, 0 ), //Down
            new BABYLON.Vector3( 1, 0, 0 ), //Forward
            new BABYLON.Vector3( -1, 0, 0 ), //Backward
            new BABYLON.Vector3( 0, 0, 1 ), //Left
            new BABYLON.Vector3( 0, 0, -1 ) //Right
        ];

        for ( let i = 0; i < rotations.length; i++ ) {

            faces.set( suffix[i], new PlanetQuadtree( this.#planet, suffix[i], rotations[i] ) );
        }
    }
    
    #createMask() {

        this.#planet.mask = BABYLON.MeshBuilder.CreateSphere( "planet_mask", { diameter: this.#planet.config.radius * 2, segments: 16 }, this.scene );
        this.#planet.mask.material = this.#planet.game.planets.getMaskMaterial();
        this.#planet.mask.parent = this.#planet.root;

        this.#planet.game.star.shadow.cast( this.#planet.mask, undefined, undefined, false );
    }

    #debugInfluence() {

        const debug_influence = BABYLON.MeshBuilder.CreateSphere( "planet_debug_influence", { diameter: ( this.#planet.config.radius + this.#planet.config.influence ) * 2, segments: 32 }, this.#planet.scene );
        debug_influence.material = this.#planet.scene.debugMaterialRed;
        debug_influence.parent = this.#planet.root;

        const debug_maxHeight = BABYLON.MeshBuilder.CreateSphere( "planet_debug_maxHeight", { diameter: ( this.#planet.config.radius + this.#planet.config.maxHeight ) * 2, segments: 32 }, this.#planet.scene );
        debug_maxHeight.material = this.#planet.scene.debugMaterialRed;
        debug_maxHeight.parent = this.#planet.root;
    }

}