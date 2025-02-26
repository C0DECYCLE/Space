/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IAbstractSpaceship extends ICameraTargetable, IConfigurable {

    lod: ILOD;

    travel: ISpaceshipTravel;

    physics: ISpaceshipPhysics;

    thrusters?: ISpaceshipThrusters;

    get root(): BABYLON.TransformNode;

    get position(): BABYLON.Vector3;

    get rotationQuaternion(): BABYLON.Quaternion;

    get hasController(): boolean;

    get nearPlanet(): IPlanet | false;

    get isLanded(): boolean;
    
    post(): void;

    update(): void;

    planetInsert( planet: IPlanet, distance: float, planetThreashold: float ): void;

    enter( player: IPlayer ): void;

    leave( player: IPlayer ): void;

    land(): void;

    takeoff(): void;
    
}