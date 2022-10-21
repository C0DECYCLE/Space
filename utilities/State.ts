/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class State implements IState {

    public onEnter: (oldKey: string, params: any) => void;
    public onLeave: (newKey: string, params: any) => void;

    constructor( onEnter: IState["onEnter"], onLeave: IState["onLeave"] ) {

        this.onEnter = onEnter;
        this.onLeave = onLeave;
    }
    
}