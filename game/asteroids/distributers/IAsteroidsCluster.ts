/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IAsteroidsCluster extends IAsteroidsDistributer {

    readonly list: IAsteroid[];
    
    set parent( value: BABYLON.TransformNode );

    offsetAllAsteroids( position: BABYLON.Vector3 ): void;

    toggleAllAsteroids( value: boolean ): void;

}