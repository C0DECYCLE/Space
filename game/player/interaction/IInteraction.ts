/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IInteraction {

    readonly mesh: BABYLON.InstancedMesh;
    
    readonly event: TInteractionEvent;
    
    readonly leaveEvent?: TInteractionEvent;

    highlight: boolean;

}