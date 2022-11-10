/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ICameraTargetPlayer extends IAbstractCameraTarget {

    update( player: IPlayer ): void;

    onPointerMove( player: IPlayer, event: BABYLON.PointerInfo ): void

}