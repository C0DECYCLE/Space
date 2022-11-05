/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlanetPhysics {

    readonly planet: IPlanet;

    enable( mesh: BABYLON.Mesh, size: number ): void;

    disable( mesh: BABYLON.Mesh ): void;

    pull( physicsEntity: IPhysicsEntity ): BABYLON.Vector3;

    spin( physicsEntity: IPhysicsEntity ): BABYLON.Vector3;

    getDistanceAboveGround( physicsEntity: IPhysicsEntity, up: BABYLON.Vector3 ): number;

}