"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraOrigin {

    actualPosition = new BABYLON.Vector3( 0, 0, 0 );
    relativePosition = new BABYLON.Vector3( 0, 0, 0 );

    #camera = null;
    
    constructor( camera ) {

        this.#camera = camera;

        this.#setupRoot();
        this.#registerObservables();
    }

    toRelative( vector ) {

        return vector.subtractInPlace( this.actualPosition );
    }

    toActual( vector ) {

        return vector.addInPlace( this.relativePosition );
    }

    setupNode( node ) {

        node._actualPosition = new BABYLON.Vector3();
        node._relativePosition = new BABYLON.Vector3();

        const insProps = this.#inspectorCustomProperties();

        node.inspectableCustomProperties = !node.inspectableCustomProperties ? insProps : node.inspectableCustomProperties.concat( insProps );
    }

    #setupRoot() {

        this.#camera.root._actualPosition = this.actualPosition;
        this.#camera.root._relativePosition = this.relativePosition;
        this.#camera.root.inspectableCustomProperties = this.#inspectorCustomProperties();
    }

    #registerObservables() {

        this.#camera.scene.onBeforeRenderObservable.add( () => this.#beforeRender() );
        this.#camera.scene.onAfterRenderObservable.add( () => this.#afterRender() );
    }

    #inspectorCustomProperties() {

        return [

            {
                label: "Actual Position",
                propertyName: "_actualPosition",
                type: BABYLON.InspectableType.Vector3,
            },

            {
                label: "Render Position",
                propertyName: "_relativePosition",
                type: BABYLON.InspectableType.Vector3,
            }
        ];
    }

    #beforeRender() {

        const scene = this.#camera.scene;
        
        for ( let i = 0; i < scene.rootNodes.length; i++ ) {

            const node = scene.rootNodes[i];

            if ( node.name === "camera" || node.isEnabled( false ) === false || !node.position ) {
                
                continue;
            }
            
            if ( !node._actualPosition && !node._relativePosition ) {

                this.setupNode( node );
            }

            node._actualPosition.copyFrom( node.position );

            this.toRelative( node.position );
            
            node._relativePosition.copyFrom( node.position );
        }
    }

    #afterRender() {
        
        const scene = this.#camera.scene;

        for ( let i = 0; i < scene.rootNodes.length; i++ ) {

            const node = scene.rootNodes[i];

            if ( node.name !== "camera" && node.isEnabled( false ) === true && node._actualPosition ) {

                node.position.copyFrom( node._actualPosition );
            }
        }
    }

}