/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ICameraTargetSpaceship extends ICameraTarget {

    update( spaceship: ISpaceship ): void;

    onPointerMove( spaceship: ISpaceship, event: BABYLON.PointerInfo ): void;

}