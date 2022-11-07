/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

Object {

    _actualPosition: BABYLON.Vector3;

    _relativePosition: BABYLON.Vector3;

}

class CameraOrigin implements ICameraOrigin {

    public get actual(): BABYLON.Vector3 {

        return this.actualPosition;
    }

    private readonly camera: ICamera;
    
    private readonly actualPosition: BABYLON.Vector3 = new BABYLON.Vector3( 0, 0, 0 );
    private readonly relativePosition: BABYLON.Vector3 = new BABYLON.Vector3( 0, 0, 0 );

    public constructor( camera: ICamera ) {

        this.camera = camera;

        this.setupRoot();
        this.registerObservables();
    }

    private toRelative( vector: BABYLON.Vector3 ): BABYLON.Vector3 {

        return vector.subtractInPlace( this.actualPosition );
    }

    private setupNode( node: BABYLON.Node ): void {

        node._actualPosition = new BABYLON.Vector3();
        node._relativePosition = new BABYLON.Vector3();

        const insProps = this.inspectorCustomProperties();

        node.inspectableCustomProperties = !node.inspectableCustomProperties ? insProps : node.inspectableCustomProperties.concat( insProps );
    }

    private setupRoot(): void {

        this.camera.root._actualPosition = this.actualPosition;
        this.camera.root._relativePosition = this.relativePosition;
        this.camera.root.inspectableCustomProperties = this.inspectorCustomProperties();
    }

    private registerObservables(): void {

        Space.scene.onBeforeRenderObservable.add( ( _eventData: BABYLON.Scene, _eventState: BABYLON.EventState ): void => this.beforeRender() );
        Space.scene.onAfterRenderObservable.add( ( _eventData: BABYLON.Scene, _eventState: BABYLON.EventState ): void => this.afterRender() );
    }

    private inspectorCustomProperties(): BABYLON.IInspectable[] {

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

    private beforeRender(): void {

        const scene: BABYLON.Scene = Space.scene;
        
        for ( let i: number = 0; i < scene.rootNodes.length; i++ ) {

            const node: any = scene.rootNodes[i];

            if ( node.name === "camera" || !node.position ) {
                
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

    private afterRender(): void {
        
        const scene: BABYLON.Scene = Space.scene;

        for ( let i: number = 0; i < scene.rootNodes.length; i++ ) {

            const node: any = scene.rootNodes[i];

            if ( node.name !== "camera" && node.position && node._actualPosition ) {
                
                node.position.copyFrom( node._actualPosition );
            }
        }
    }

}