/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Interaction implements IInteraction {

    public readonly mesh: BABYLON.InstancedMesh;
    
    public readonly event: TInteractionEvent;
    public readonly leaveEvent?: TInteractionEvent;

    public highlight: boolean;
    
    constructor( mesh: BABYLON.InstancedMesh, event: TInteractionEvent, leaveEvent: TInteractionEvent | undefined, highlight: boolean ) {

        this.mesh = mesh;

        this.event = event;
        this.leaveEvent = leaveEvent;

        this.highlight = highlight;
    }
    
}