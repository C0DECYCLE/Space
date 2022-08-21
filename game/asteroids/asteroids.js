"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Asteroids {

    config = {

    };

    manager = null;
    scene = null;

    list = new Map();
    template = null;

    constructor( manager, config ) {

        this.manager = manager;
        this.scene = this.manager.scene;

        EngineUtils.configure( this.config, config );

        this.#createTemplate();
    }

    register( type, config ) {

        let asteroids = null;

        switch ( type ) {

            case "cluster": asteroids = new AsteroidsCluster( this.manager, config ); break;

            case "ring": asteroids = new AsteroidsRing( this.manager, config ); break;
        }

        this.list.set( config.key, asteroids );
    }

    update() {

        this.list.forEach( ( asteroids, key ) => asteroids.update() );
    }

    #createTemplate() {

        this.template = BABYLON.MeshBuilder.CreateBox( "asteroids_template", { size: 1 }, this.scene );
        this.template.material = new BABYLON.StandardMaterial( "asteroids_template_material", this.scene );
        this.template.material.setColorIntensity( "#534d5f", 1.0 );
        this.template.useLODScreenCoverage = true;
        this.template.addLODLevel( 0.00001, null );  
        this.template.isLODNull = () => dummy.root.getLOD( scene.activeCamera ) == null;
        this.template.setEnabled( false );
        
        this.manager.star.shadow.receive( this.template, true, false );
    }

}