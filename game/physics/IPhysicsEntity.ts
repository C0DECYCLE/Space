/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPhysicsEntity {

    readonly delta: BABYLON.Vector3;

    readonly velocity: BABYLON.Vector3;
    
    readonly mesh: BABYLON.AbstractMesh | BABYLON.TransformNode;
    
    readonly type: EPhysicsTypes;

    get position(): BABYLON.Vector3;

    get rotationQuaternion(): BABYLON.Quaternion;

    get state(): EPhysicsStates;

    set state( value );

    get colliderMax(): float;

    get colliderMin(): float;

    get colliderSize(): BABYLON.Vector3;

    update(): void;

    pause( allowCollisions?: boolean, allowUpdate?: boolean ): void;

    resume(): void;

    registerPull( distanceAboveGround: float ): void;

    getAcceleration(): float;

    setColliderSize( size: BABYLON.Vector3 ): void;

}