/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IPlayerInteraction {

    readonly player: IPlayer;

    readonly list: IInteraction[];

    get isInteracting(): boolean;

    register( mesh: BABYLON.InstancedMesh, event: TInteractionEvent, leaveEvent?: TInteractionEvent ): void;

    unhighlightAll(): void;

    update(): void;

}