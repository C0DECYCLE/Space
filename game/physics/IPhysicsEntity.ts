/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPhysicsEntity {

    readonly delta: BABYLON.Vector3;

    readonly velocity: BABYLON.Vector3;

    readonly game: IGame;

    readonly scene: BABYLON.Scene;

    readonly mesh: BABYLON.AbstractMesh | BABYLON.TransformNode;
    
    readonly type: EPhysicsTypes;

    get position(): BABYLON.Vector3;

    get rotationQuaternion(): BABYLON.Quaternion;

    get state(): EPhysicsStates;

    set state( value );

    get colliderMax(): number;

    get colliderMin(): number;

    get colliderSize(): BABYLON.Vector3;

    update(): void;

    pause( allowCollisions?: boolean, allowUpdate?: boolean ): void;

    resume(): void;

    registerPull( distanceAboveGround: number ): void;

    getAcceleration(): number;

    setColliderSize( size: BABYLON.Vector3 ): void;

}