/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IStarShadow extends IConfigurable {

    readonly star: IStar;

    readonly light: BABYLON.DirectionalLight;

    generator: BABYLON.CascadedShadowGenerator;

    readonly renderList: SmartObjectArray< BABYLON.AbstractMesh >;

    cast( mesh: BABYLON.AbstractMesh, recursiv: boolean, value: boolean ): void;
 
    receive( mesh: BABYLON.AbstractMesh, recursiv: boolean, value: boolean ): void;

    update(): void;

}