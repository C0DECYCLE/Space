/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AsteroidsCluster implements IAsteroidsCluster {

    public config: IConfig = {

        key: UUIDv4(),
        seed: undefined,

        radius: 1000,
        height: 1000,
        density: 0.1,

        offset: null
    };

    public readonly list: IAsteroid[] = [];
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

    public get numberOfAsteroids(): int {

        return this.list.length;
    }

    public set parent( value: BABYLON.TransformNode ) {

        if ( this.hasCustomRoot === false ) {

            this.root.parent = value;     

        } else {

            this.root = value;

            for ( let i: int = 0; i < this.list.length; i++ ) {

                this.list[i].parent = this.root;
            }
        }
    }

    private hasCustomRoot: boolean = false;

    public constructor( config?: IConfig, customRoot?: BABYLON.TransformNode ) {

        EngineUtils.configure( this, config );

        this.createRoot( customRoot );
        this.spawnAsteroids();
    }
    
    public update(): void {

        for ( let i: int = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    public offsetAllAsteroids( position: BABYLON.Vector3 ): void {

        for ( let i: int = 0; i < this.list.length; i++ ) {

            this.list[i].position.addInPlace( position );
        }
    }

    private createRoot( customRoot?: BABYLON.TransformNode ): void {

        if ( customRoot instanceof BABYLON.TransformNode ) {

            this.hasCustomRoot = true;
            this.root = customRoot;

        } else {

            this.root = new BABYLON.TransformNode( `asteroids_cluster${ this.config.key }`, scene );
            this.root.rotationQuaternion = this.root.rotation.toQuaternion();
        }
    }

    private spawnAsteroids(): void {

        const random: any = this.config.seed !== undefined && typeof this.config.seed === "function" ? this.config.seed : seedrandom( this.config.seed );
        const count: int = Math.floor( ( ( 2 * this.config.radius + this.config.height ) / 3 ) * this.config.density );
        const spread: BABYLON.Vector3 = new BABYLON.Vector3( this.config.radius, this.config.height, this.config.radius );

        for ( let i: int = 0; i < count; i++ ) {
            
            const asteroid: IAsteroid = new Asteroid( { random: random } );
            asteroid.position.copyFromFloats( random() * 2 - 1, random() * 2 - 1, random() * 2 - 1 ).multiplyInPlace( spread );
            asteroid.parent = this.root;

            if ( this.config.offset !== null ) {

                asteroid.position.addInPlace( this.config.offset );
            }

            this.list.push( asteroid );
        }
    }

}