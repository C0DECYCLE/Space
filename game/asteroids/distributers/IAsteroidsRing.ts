/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

interface IAsteroidsRing extends IAsteroidsDistributer {

    readonly list: IAsteroidsCluster[];

    get numberOfClusters(): number;

}