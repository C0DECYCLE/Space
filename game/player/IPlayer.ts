/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlayer extends ICameraTargetable, IConfigurable, ISingleton {

    mesh: BABYLON.Mesh;

    physics: IPlayerPhysics;

    interaction: IPlayerInteraction;

    readonly state: StateMachine;

    get root(): BABYLON.Mesh;

    get position(): BABYLON.Vector3;

    get rotationQuaternion(): BABYLON.Quaternion;

    get planet(): IPlanet | null;

    get spaceship(): IAbstractSpaceship | null;

    update(): void;

    planetInsert( planet: IPlanet, distance: number, planetThreashold: number ): void;

}