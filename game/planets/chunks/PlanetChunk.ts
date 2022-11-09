/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetChunk extends BABYLON.Mesh implements IPlanetChunk {

    public readonly planet: IPlanet;
    
    public get size(): int {

        return this.sizeValue;
    }

    public get resolution(): int {

        return this.resolutionValue;
    }
    
    private sizeValue: int;
    private resolutionValue: int;

    private doesShadows: boolean = false;
    
    public constructor( planet: IPlanet, nodeKey: string, config: IConfig ) {
    
        super( `planet${ planet.config.key }_chunk_${ nodeKey }`, scene );
    
        this.planet = planet;

        this.setupMesh();
        this.setupGeometry( config );

        this.setupShadow( config.size );
        this.setupPhysics( config.size );
    }

    /*
    public stitch( neighbors ): void {

        //this.#stitchGeometry( neighbors, this.size, this.resolution );
    }
    */

    public toggleShadow( value: boolean ): void {

        if ( value === true ) {

            this.addShadow( this.sizeValue );

        } else {

            this.removeShadow();
        }
    }

    public override dispose(): void {

        this.removeShadow();
        super.dispose( ...arguments );
    }

    private setupMesh(): void {

        this.isPickable = false;
        this.material = this.planet.material;
        this.parent = this.planet.root;
    }

    private setupGeometry( config: IConfig ): void {

        this.sizeValue = config.size;
        this.resolutionValue = config.resolution;

        const vertexData: BABYLON.VertexData = new BABYLON.VertexData();
        vertexData.positions = this.buildPositions( config.position, config.fixRotationQuaternion, config.size, config.resolution );
        vertexData.indices = this.buildIndices( config.resolution ); 
        //
        //vertexData.normals = []; BABYLON.VertexData.ComputeNormals( vertexData.positions, vertexData.indices, vertexData.normals );
        //
        vertexData.applyToMesh( this, false );
    } 

    private setupPhysics( size: int ): void {

        this.planet.physics.enable( this, size );
    }

    private setupShadow( size: int ): void {

        if ( this.planet.helper.maskEnabled === true ) {

            this.addShadow( size );
        }
    }

    private addShadow( _size: int ): void {

        //causes weird glitch
        //if ( size < Star.getInstance().shadow.config.radius / PlanetQuadtree.divisionSizeFactor ) {
        if ( this.doesShadows === false ) {    

            //Star.getInstance().shadow.cast( this, false, true );        
            Star.getInstance().shadow.receive( this, false, true );  

            this.doesShadows = true;
        }
    }

    private removeShadow(): void {

        if ( this.doesShadows === true ) {

            //Star.getInstance().shadow.cast( this, false, false );        
            Star.getInstance().shadow.receive( this, false, false );  

            this.doesShadows = false;
        }
    }

    private buildPositions( offset: BABYLON.Vector3, fixRotationQuaternion: BABYLON.Quaternion, size: int, resolution: int ): Float32Array {

        let row: int;
        let col: int;
        const positions: Float32Array = new Float32Array( (resolution+1) * (resolution+1) * 3 );
        let position: BABYLON.Vector3;
        let i: int = 0;

        for ( row = 0; row <= resolution; row++ ) {
            for ( col = 0; col <= resolution; col++) {

                position = new BABYLON.Vector3( (col * size) / resolution - size / 2.0, 0, ((resolution - row) * size) / resolution - size / 2.0 );
                position.applyRotationQuaternionInPlace( fixRotationQuaternion );
                position.addInPlace( offset );
                PlanetUtils.terrainify( this.planet, position );

                positions[i] = position.x;
                positions[i+1] = position.y;
                positions[i+2] = position.z;

                i += 3;
            }
        }   
        
        return positions;
    }

    private buildIndices( resolution: int ): Uint16Array {

        let row: int;
        let col: int;
        const indices: Uint16Array = new Uint16Array( resolution * resolution * 6 );
        let i: int = 0;

        for ( row = 0; row < resolution; row++ ) {
            for ( col = 0; col < resolution; col++ ) {

                indices[i] = col + 1 + (row + 1) * (resolution + 1);
                indices[i+1] = col + 1 + row * (resolution + 1);
                indices[i+2] = col + row * (resolution + 1);

                indices[i+3] = col + (row + 1) * (resolution + 1);
                indices[i+4] = col + 1 + (row + 1) * (resolution + 1);
                indices[i+5] = col + row * (resolution + 1);

                i += 6;
            }
        }

        return indices;
    }

    /*
    #stitchGeometry( neighbors, size, resolution ) {

        let row;
        let col;
        const positions = this.getVerticesData( BABYLON.VertexBuffer.PositionKind );

        for ( row = 1; row <= resolution-1; row += 2 ) {
            for ( col = 0; col <= resolution; col += resolution ) {

                this.#stitchVertex( positions, neighbors, row, col, size, resolution );
            }
        }

        for ( col = 1; col <= resolution-1; col += 2 ) {
            for ( row = 0; row <= resolution; row += resolution ) {

                this.#stitchVertex( positions, neighbors, row, col, size, resolution );
            }
        }
        
        this.updateVerticesData( BABYLON.VertexBuffer.PositionKind, positions );
    }

    #stitchVertex( positions, neighbors, row, col, size, resolution ) {
        //set updatable true!
        const edgeCase = this.#getEdgeCase( neighbors, row, col, size, resolution );

        if ( edgeCase !== false ) {
            
            const i = (row * (resolution+1) + col ) * 3;
            const position = new BABYLON.Vector3( positions[i], positions[i+1], positions[i+2] );

            position.scaleInPlace( 1.01 );

            positions[i] = position.x;
            positions[i+1] = position.y;
            positions[i+2] = position.z;
        }
    }

    #getEdgeCase( neighbors, row, col, size, resolution ) {

        const up = row === 0 && neighbors[0] === true;
        const down = row === resolution && neighbors[1] === true;
        const left = col === 0 && neighbors[2] === true;
        const right = col === resolution && neighbors[3] === true;
    
        if ( size < this.#planet.config.radius * 2 && ( up || down || left || right ) && ( row % 2 === 1 || col % 2 === 1 ) ) {
    
            if ( left === true || right === true ) {
    
                return [
                    new BABYLON.Vector3( (col * size) / resolution - size / 2.0, 0, ((resolution - (row - 1)) * size) / resolution - size / 2.0 ),
                    new BABYLON.Vector3( (col * size) / resolution - size / 2.0, 0, ((resolution - (row + 1)) * size) / resolution - size / 2.0 ) 
                ];

            } else if ( up === true || down === true ) {
    
                return [
                    new BABYLON.Vector3( ((col - 1) * size) / resolution - size / 2.0, 0, ((resolution - row) * size) / resolution - size / 2.0 ),
                    new BABYLON.Vector3( ((col + 1) * size) / resolution - size / 2.0, 0, ((resolution - row) * size) / resolution - size / 2.0 ) 
                ];
            }
        }
    
        return false;
    }
    */

}