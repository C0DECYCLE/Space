/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AsteroidsRing implements IAsteroidsRing, IAsteroidsDistributer, IConfigurable {

    public config: IConfig = new Config(

        [ "key", UUIDv4() ],
        [ "seed", undefined ],

        [ "radius", 1000 ],
        [ "spread", 200 ],
        [ "height", 1000 ],
        [ "density", 0.05 ]
    );

    public readonly game: IGame;
    public readonly scene: BABYLON.Scene;

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

    public get numberOfClusters(): number {

        return this.list.length;
    }

    public get numberOfAsteroids(): number {

        let count: number = 0;

        for ( let i: number = 0; i < this.list.length; i++ ) {

            count += this.list[i].numberOfAsteroids;
        }

        return count;
    }

    public constructor( game: IGame, config: IConfig ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure( this, config );

        this.createRoot();
        this.spawnClusters();
    }

    public update(): void {

        for ( let i: number = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    private createRoot(): void {

        this.root = new BABYLON.TransformNode( `asteroids_ring${ this.config.key }`, this.scene );
        this.root.rotationQuaternion = this.root.rotation.toQuaternion();
    }

    private spawnClusters(): void {

        const random: any = seedrandom( this.config.seed );
        const count: number = Math.floor( ( Math.PI * 2 * this.config.radius ) / ( this.config.spread * 2 ) );
        
        for ( let i: number = 0; i < count; i++ ) {

            const angle: number = ( 360 / count ) * i * EngineUtils.toRadian;
            const offset: BABYLON.Vector3 = new BABYLON.Vector3( Math.cos( angle ), 0, Math.sin( angle ) ).scaleInPlace( this.config.radius );

            const cluster: IAsteroidsCluster = new AsteroidsCluster( this.game, { key: i, seed: random, radius: this.config.spread, height: this.config.height, density: this.config.density, offset: offset }, this.root );

            this.list.push( cluster );
        }
    }

}