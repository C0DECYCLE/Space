"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraOrigin {

    parent = null;
    
    actualPosition = new BABYLON.Vector3( 0, 0, 0 );
    relativePosition = new BABYLON.Vector3( 0, 0, 0 );

    constructor( parent ) {

        this.parent = parent;

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

        let insProps = this.#inspectorCustomProperties();

        node.inspectableCustomProperties = !node.inspectableCustomProperties ? insProps : node.inspectableCustomProperties.concat( insProps );
    }

    #setupRoot() {

        this.parent.root._actualPosition = this.actualPosition;
        this.parent.root._relativePosition = this.relativePosition;
        this.parent.root.inspectableCustomProperties = this.#inspectorCustomProperties();
    }

    #registerObservables() {

        this.parent.scene.onBeforePhysicsObservable.add( () => this.#beforePhysics() );
        this.parent.scene.onAfterPhysicsObservable.add( () => this.#afterPhysics() );
        this.parent.scene.onAfterRenderObservable.add( () => this.#afterRender() );
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

    #beforePhysics() {

        let scene = this.parent.scene;

        if ( scene.rootNodes[0].name != "camera" ) {

            console.error( "Camera node not at position 0 in scene.rootNodes!" );

            return;
        }
    
        for ( let i = 1; i < scene.rootNodes.length; i++ ) {

            let node = scene.rootNodes[i];
            
            if ( !node.position ) {
                
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

    #afterPhysics() {
        
        let scene = this.parent.scene;

        for ( let i = 1; i < scene.rootNodes.length; i++ ) {

            let node = scene.rootNodes[i];

            if ( node.physicsImpostor && node._actualPosition && node._relativePosition ) {
                
                let physicsStep = node.position.subtract( node._relativePosition );

                node._actualPosition.addInPlace( physicsStep );
            }
        }
    }

    #afterRender() {
        
        let scene = this.parent.scene;

        for ( let i = 1; i < scene.rootNodes.length; i++ ) {

            let node = scene.rootNodes[i];

            if ( node._actualPosition ) {

                node.position.copyFrom( node._actualPosition );
            }
        }
    }

}