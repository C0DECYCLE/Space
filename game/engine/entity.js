"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Entity extends BABYLON.TransformNode {

    originPosition = new BABYLON.Vector3( 0, 0, 0 );

    #camera = null;
    #physicsMesh = null;
    #previousPosition = new BABYLON.Vector3( 0, 0, 0 );

    constructor( name, scene, camera ) {

        super( `${ name }_entity`, scene );

        this.#camera = camera;

        this.inspectableCustomProperties = [
            {
                label: "Origin Position",
                propertyName: "originPosition",
                type: BABYLON.InspectableType.Vector3,
            }
        ];

        this.rotationQuaternion = this.rotation.toQuaternion();

        this.#camera.add( this );
    }

    originUpdate() {
        
        this.position.copyFrom( this.originPosition ).subtractInPlace( this.#camera.originPosition );
        this.#previousPosition.copyFrom( this.position );
    }

    computeOriginMatrix() {

        let matrix = new BABYLON.Matrix();
        
        BABYLON.Matrix.FromQuaternionToRef( this.rotationQuaternion, matrix );

        return matrix.setTranslation( this.originPosition );
    }

    getBoundingInfo( /*BABYLON ARGUMENTS*/ ) {

        if ( this.#physicsMesh == null ) {
            
            console.error( "Entity: Requires physicsMesh!" );
        }

        return this.#physicsMesh.getBoundingInfo( ...arguments );
    }

    getIndices( /*BABYLON ARGUMENTS*/ ) {

        if ( this.#physicsMesh == null ) {
            
            console.error( "Entity: Requires physicsMesh!" );
        }

        return this.#physicsMesh.getIndices( ...arguments );
    }

    getVerticesData( /*BABYLON ARGUMENTS*/ ) {

        if ( this.#physicsMesh == null ) {
            
            console.error( "Entity: Requires physicsMesh!" );
        }

        return this.#physicsMesh.getVerticesData( ...arguments );
    }

    enableOriginPhysics( mesh, type, options ) {

        this.#physicsMesh = mesh;
        this.physicsImpostor = new BABYLON.PhysicsImpostor( this, type, options, this.getScene() );
        physicsViewer.showImpostor( this.physicsImpostor, this );

        this.physicsImpostor.registerAfterPhysicsStep( () => {
            
            let offset = this.position.subtract( this.#previousPosition );

            this.originPosition.addInPlace( offset );
		} );  
    }

    dispose( /*BABYLON ARGUMENTS*/ ) {

        this.#camera.remove( this );

        super.dispose( ...arguments );
    }
}