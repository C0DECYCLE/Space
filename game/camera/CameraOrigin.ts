/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface Object {

    __actualPosition?: BABYLON.Vector3;

    __relativePosition?: BABYLON.Vector3;

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

        node.__actualPosition = new BABYLON.Vector3();
        node.__relativePosition = new BABYLON.Vector3();

        const insProps = this.inspectorCustomProperties();

        node.inspectableCustomProperties = !node.inspectableCustomProperties ? insProps : node.inspectableCustomProperties.concat( insProps );
    }

    private setupRoot(): void {

        this.camera.root.__actualPosition = this.actualPosition;
        this.camera.root.__relativePosition = this.relativePosition;
        this.camera.root.inspectableCustomProperties = this.inspectorCustomProperties();
    }

    private registerObservables(): void {

        scene.onBeforeRenderObservable.add( ( _eventData: BABYLON.Scene, _eventState: BABYLON.EventState ): void => this.beforeRender() );
        scene.onAfterRenderObservable.add( ( _eventData: BABYLON.Scene, _eventState: BABYLON.EventState ): void => this.afterRender() );
    }

    private inspectorCustomProperties(): BABYLON.IInspectable[] {

        return [

            {
                label: "Actual Position",
                propertyName: "__actualPosition",
                type: BABYLON.InspectableType.Vector3,
            },

            {
                label: "Render Position",
                propertyName: "__relativePosition",
                type: BABYLON.InspectableType.Vector3,
            }
        ];
    }

    private beforeRender(): void {
        
        for ( let i: int = 0; i < scene.rootNodes.length; i++ ) {

            const node: any = scene.rootNodes[i];

            if ( node.name === "camera" || !node.position ) {
                
                continue;
            }
            
            if ( !node.__actualPosition && !node.__relativePosition ) {

                this.setupNode( node );
            }
            
            node.__actualPosition.copyFrom( node.position );

            this.toRelative( node.position );
            
            node.__relativePosition.copyFrom( node.position );
        }
    }

    private afterRender(): void {
    
        for ( let i: int = 0; i < scene.rootNodes.length; i++ ) {

            const node: any = scene.rootNodes[i];

            if ( node.name !== "camera" && node.position && node.__actualPosition ) {
                
                node.position.copyFrom( node.__actualPosition );
            }
        }
    }

}