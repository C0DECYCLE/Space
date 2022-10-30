/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface ICameraTargetPlayer extends ICameraTarget {

    update( player: IPlayer ): void;

    onPointerMove( player: IPlayer, event: BABYLON.PointerInfo ): void

}