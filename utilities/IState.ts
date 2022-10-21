/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IState {

    onEnter: ( oldKey: string, params: any ) => void;
    onLeave: ( newKey: string, params: any ) => void;
}