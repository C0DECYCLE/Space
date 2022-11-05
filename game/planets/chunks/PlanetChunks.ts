/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetChunks implements IPlanetChunks {
 
    public readonly planet: IPlanet;
    
    public readonly nodes: Map< string, IPlanetChunksNode > = new Map< string, IPlanetChunksNode >();

    public constructor( planet: IPlanet ) {

        this.planet = planet;
    }

    public insertQuadtrees( distance: number ): void {
        
        this.doQuadtree( distance );
        this.doChunks();
    }

    public node( params: IPlanetInsertParameters, dot: number, nodeKey: string, position: BABYLON.Vector3, fixRotationQuaternion: BABYLON.Quaternion, size: number, faceSize: number ): void {

        if ( dot > params.occlusionFallOf ) {
                
            this.evalNode( params, nodeKey, position, fixRotationQuaternion, size, faceSize );
        }
    }

    public toggleShadows( value: boolean ): void {

        this.nodes.forEach( ( data: IPlanetChunksNode, _nodeKey: string ): void => data.chunk.toggleShadow( value ) );
    }

    private doQuadtree( distance: number ): void {
        
        const params: IPlanetInsertParameters = new PlanetInsertParameters( this.planet, distance );
        
        this.planet.faces.forEach( ( face: IPlanetQuadtree, _suffic: string ): void => face.insert( params ) );
    }

    private evalNode( params: IPlanetInsertParameters, nodeKey: string, position: BABYLON.Vector3, fixRotationQuaternion: BABYLON.Quaternion, size: number, faceSize: number ): void {

        const resolution: number = this.getResolution( params, size, faceSize );
        const node: IPlanetChunksNode | undefined = this.nodes.get( nodeKey );
        
        if ( node !== undefined ) {

            if ( node.chunk.resolution === resolution ) {

                node.keep = true;
            }

        } else {

            this.nodes.set( nodeKey, new PlanetChunksNode( new PlanetChunk( this.planet, nodeKey, new Config(

                [ "position", position ],
                [ "fixRotationQuaternion", fixRotationQuaternion ],

                [ "size", size ],
                [ "resolution", resolution ]
            ) ) ) ); 
        }
    }

    private getResolution( params: IPlanetInsertParameters, size: number, faceSize: number ): number {
        
        if ( size >= faceSize ) { 
            
            if ( params.distanceRadiusFactor > PlanetQuadtree.INSERT_LIMIT ) {

                return this.planet.config.resolution / 4;
                
            } else if ( params.distanceRadiusFactor > PlanetQuadtree.INSERT_HALF_LIMIT ) {

                return this.planet.config.resolution / 2;
            }
        }

        return this.planet.config.resolution;
    }

    private doChunks(): void {

        this.nodes.forEach( ( data: IPlanetChunksNode, nodeKey: string ): void => {
            
            if ( data.keep === false ) {
                
                this.disposeNode( nodeKey, data );

            } else {

                //this.#stitchNode( nodeKey, data );
            }
            
            data.keep = false;
        } ); 
    }

    private disposeNode( nodeKey: string, data: IPlanetChunksNode ): void {

        data.chunk.dispose();
        this.nodes.delete( nodeKey );
    }

    /*
    #stitchNode( nodeKey, data ) {

        //compute neighbors
        const neighbors = this.#planet.stitch.stitch( nodeKey, this.#nodes ); 
        if ( neighbors !== undefined ) data.chunk.stitch( neighbors );
    }
    */

}