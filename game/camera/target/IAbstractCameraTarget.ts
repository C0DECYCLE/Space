/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IAbstractCameraTarget extends IConfigurable {

    update( target: ICameraTargetable ): void;

    onPointerMove( target: ICameraTargetable, event: BABYLON.PointerInfo ): void;

    focus( lerp: number ): void;

}