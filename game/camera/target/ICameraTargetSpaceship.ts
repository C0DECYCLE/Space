/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ICameraTargetSpaceship extends IAbstractCameraTarget {

    update( spaceship: IAbstractSpaceship ): void;

    onPointerMove( spaceship: IAbstractSpaceship, event: BABYLON.PointerInfo ): void;

}