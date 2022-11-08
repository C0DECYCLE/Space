/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AsteroidsCluster implements IAsteroidsCluster {

    public config: IConfig = new Config(

        [ "key", UUIDv4() ],
        [ "seed", undefined ],

        [ "radius", 1000 ],
        [ "height", 1000 ],
        [ "density", 0.1 ],

        [ "offset", null ]
    );

    public readonly list: IAsteroid[] = [];
    public root: BABYLON.TransformNode;

    public get position(): BABYLON.Vector3 | void {
        
        if ( this.hasCustomParent === false ) {

            return this.root.position;     

        } else {

            console.warn( "AsteroidCluster: Doesn't has a own position." );
        }
    }

    public get rotationQuaternion(): BABYLON.Quaternion | void {
        
        if ( this.hasCustomParent === false ) {

            if ( this.root.rotationQuaternion === null ) {

                this.root.rotationQuaternion = this.root.rotation.toQuaternion();
            }

            return this.root.rotationQuaternion;     

        } else {

            console.warn( "AsteroidCluster: Doesn't has a own rotationQuaternion." );
        }
    }

    public get numberOfAsteroids(): number {

        return this.list.length;
    }

    public set parent( value: BABYLON.TransformNode ) {

        if ( this.hasCustomParent === false ) {

            this.root.parent = value;     

        } else {

            this.root = value;

            for ( let i = 0; i < this.list.length; i++ ) {

                this.list[i].parent = this.root;
            }
        }
    }

    private hasCustomParent: boolean = false;

    public constructor( config?: IConfig, customParent?: BABYLON.TransformNode ) {

        EngineUtils.configure( this, config );

        this.createRoot( customParent );
        this.spawnAsteroids();
    }
    
    public update(): void {

        for ( let i: number = 0; i < this.list.length; i++ ) {

            this.list[i].update();
        }
    }

    public offsetAllAsteroids( position: BABYLON.Vector3 ): void {

        for ( let i: number = 0; i < this.list.length; i++ ) {

            this.list[i].position.addInPlace( position );
        }
    }

    private createRoot( customParent?: BABYLON.TransformNode ): void {

        this.hasCustomParent = customParent !== undefined;

        if ( customParent instanceof BABYLON.TransformNode ) {

            this.root = customParent;

        } else {

            this.root = new BABYLON.TransformNode( `asteroids_cluster${ this.config.key }`, scene );
            this.root.rotationQuaternion = this.root.rotation.toQuaternion();
        }
    }

    private spawnAsteroids(): void {

        const random: any = this.config.seed !== undefined && typeof this.config.seed === "function" ? this.config.seed : seedrandom( this.config.seed );
        const count: number = ( ( 2 * this.config.radius + this.config.height ) / 3 ) * this.config.density;
        const spread: BABYLON.Vector3 = new BABYLON.Vector3( this.config.radius, this.config.height, this.config.radius );

        for ( let i: number = 0; i < count; i++ ) {
            
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