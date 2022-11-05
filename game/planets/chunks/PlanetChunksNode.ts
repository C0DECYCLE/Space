/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetChunksNode implements IPlanetChunksNode {
    
    public keep: boolean = true;

    public readonly chunk: IPlanetChunk;

    public constructor( chunk: IPlanetChunk ) {
        
        this.chunk = chunk;
    }
    
}