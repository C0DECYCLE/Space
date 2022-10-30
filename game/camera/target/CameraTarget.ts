/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTarget implements ICameraTarget {

    public config: IConfig = new Config(  

        [ "offset", new BABYLON.Vector3( 0, 0, 0 ) ],
        [ "offsetRadius", 10 ],

        [ "focusAlpha", -Math.PI / 2 ],
        [ "focusBeta", Math.PI / 2 ],

        [ "lerpPos", 0.075 ],
        [ "lerpRot", 0.05 ],

        [ "follow", 0.0025 ]
    );

    protected readonly camera: ICamera;

    protected constructor( camera: ICamera, config: IConfig ) {

        this.camera = camera;

        EngineUtils.configure( this, config );
    }

    public focus( lerp: number = this.config.lerpRot ): void {
        
        this.camera.camera.alpha = BABYLON.Scalar.Lerp( this.camera.camera.alpha, this.config.focusAlpha, lerp );
        this.camera.camera.beta = BABYLON.Scalar.Lerp( this.camera.camera.beta, this.config.focusBeta, lerp );
    }
    
    public update( target: ICameraTargetable ): void {

        this.syncWithTarget( target );
    }

    public onPointerMove( _target: ICameraTargetable, _event: BABYLON.PointerInfo ): void {

        return;
    }

    protected redirect( target: ICameraTargetable ): void {

        target.root.rotate( BABYLON.Axis.Y, this.config.focusAlpha - this.camera.camera.alpha, BABYLON.Space.LOCAL );
        target.root.rotate( BABYLON.Axis.X, this.config.focusBeta - this.camera.camera.beta, BABYLON.Space.LOCAL );

        this.camera.rotationQuaternion.copyFrom( target.rotationQuaternion );
    }
    
    protected free( event: BABYLON.PointerInfo ): void {

        const deltaCorrection: number = this.camera.game.engine.deltaCorrection;

        this.camera.camera.alpha -= event.event.movementX * this.camera.controls.config.panning * deltaCorrection;
        this.camera.camera.beta -= event.event.movementY * this.camera.controls.config.panning * deltaCorrection;
    }

    protected followPointer( target: ICameraTargetable, event: BABYLON.PointerInfo ): void {
        
        const deltaCorrection: number = this.camera.game.engine.deltaCorrection;
        
        target.root.rotate( BABYLON.Axis.Y, event.event.movementX * this.config.follow * deltaCorrection, BABYLON.Space.LOCAL );
        target.root.rotate( BABYLON.Axis.X, event.event.movementY * this.config.follow * deltaCorrection, BABYLON.Space.LOCAL );
    }

    protected syncWithTarget( target: ICameraTargetable ): void {

        this.camera.position.copyFrom( this.syncPosition( target ) );
        this.camera.rotationQuaternion.copyFrom( this.syncRotationQuaternion( target ) );
        this.camera.camera.radius = this.syncRadius( target );
    }

    protected syncPosition( target: ICameraTargetable ): BABYLON.Vector3 {

        return BABYLON.Vector3.Lerp( this.camera.position, target.position.add( this.config.offset.applyRotationQuaternion( target.rotationQuaternion ) ), this.config.lerpPos );
    }
    
    protected syncRotationQuaternion( target: ICameraTargetable ): BABYLON.Quaternion {

        return BABYLON.Quaternion.Slerp( this.camera.rotationQuaternion, target.rotationQuaternion, this.config.lerpRot );
    }

    protected syncRadius( _target: ICameraTargetable ): number {

        return BABYLON.Scalar.Lerp( this.camera.camera.radius, this.config.offsetRadius, this.config.lerpPos );
    }

}