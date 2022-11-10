/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AsteroidsRing implements IAsteroidsRing {

    public config: IConfig = {

        key: UUIDv4(),
        seed: undefined,

        radius: 1000,
        spread: 200,
        height: 1000,
        density: 0.05
    };

    public readonly list: IAsteroidsCluster[] = [];
    public root: BABYLON.TransformNode;
    
    public get position(): BABYLON.Vector3 {
        
        return this.root.position;
    }

    public get rotationQuaternion(): BABYLON.Quaternion {
        
        if ( this.root.rotationQuaternion === null ) {

            this.root.rotationQuaternion = this.root.rotation.toQuaternion();
        }

        return this.root.rotationQuaternion;
    }

    public get numberOfClusters(): int {

        return this.list.length;
    }

    public get numberOfAsteroids(): int {

        let count: int = 0;

        for ( let i: int = 0; i < this.list.length; i++ ) {

            count += this.list[i].numberOfAsteroids;
        }

        return count;
    }

    private linkedPlanet: Nullable< IPlanet > = null;

    public constructor( config?: IConfig ) {

        EngineUtils.configure( this, config );

        this.createRoot();
        this.spawnClusters();
    }

    public linkPlanet( planet: IPlanet ): void {
     
        this.linkedPlanet = planet;
        
        this.position.copyFrom( this.linkedPlanet.position );
    }

    public update(): void {

        if ( this.linkedPlanet !== null ) { if ( freeze === true ) return;

            this.updateByPlanet( this.linkedPlanet );

        } else {

            this.updateAll();
        }
    }

    private createRoot(): void {

        this.root = new BABYLON.TransformNode( `asteroids_ring${ this.config.key }`, scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    private spawnClusters(): void {

        const random: any = seedrandom( this.config.seed );
        const count: int = Math.floor( ( Math.PI * 2 * this.config.radius ) / ( this.config.spread * 2 ) );
        
        for ( let i: int = 0; i < count; i++ ) {

            const angle: float = ( 360 / count ) * i * EngineUtils.toRadian;
            const offset: BABYLON.Vector3 = new BABYLON.Vector3( Math.cos( angle ), 0, Math.sin( angle ) ).scaleInPlace( this.config.radius );
            const cluster: IAsteroidsCluster = new AsteroidsCluster( { key: i, seed: random, radius: this.config.spread, height: this.config.height, density: this.config.density, offset: offset }, this.root );

            this.list.push( cluster );
        }
    }

    private updateAll(): void {

        for ( let i: int = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    private updateByPlanet( planet: IPlanet ): void {

        if ( planet.lod.isVisible === true ) {

            const distance: float = Camera.getInstance().getScreenDistance( planet.root );
            const planetToCamera: BABYLON.Vector3 = Camera.getInstance().position.subtract( planet.position ).normalize();
            const occlusionLimit: float = planet.helper.getOcclusionLimit( distance, 0.2 );
            
            for ( let i: int = 0; i < this.list.length; i++ ) {

                this.updateCullCluster( i, planetToCamera, occlusionLimit );
            }
        }
    }

    private updateCullCluster( i: int, planetToCamera: BABYLON.Vector3, occlusionLimit: float ): void {

        const angle: float = ( 360 / this.list.length ) * i * EngineUtils.toRadian;
        const planetToCluster: BABYLON.Vector3 = new BABYLON.Vector3( Math.cos( angle ), 0, Math.sin( angle ) );
        const dot: float = BABYLON.Vector3.Dot( planetToCamera, planetToCluster );
        
        if ( dot > occlusionLimit ) {

            this.list[i].toggleAllAsteroids( true );
            this.list[i].update();

        } else {

            this.list[i].toggleAllAsteroids( false );
        }
    }

}