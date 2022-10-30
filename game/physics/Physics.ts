/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Physics implements IPhysics {

    public config: IConfig = new Config(  

    );

    public readonly game: IGame;
    public readonly scene: BABYLON.Scene;

    public get isPaused(): boolean {
        
        return this.isPausedValue;
    }

    private isPausedValue: boolean = false;

    public constructor( game: IGame, config: IConfig ) {

        this.game = game;
        this.scene = this.game.scene;

        EngineUtils.configure( this, config );

        this.setupCollisions();
    }

    public pause(): void {

        this.isPausedValue = true;
    }

    public resume(): void {

        this.isPausedValue = false;
    }
    
    private setupCollisions(): void {

        this.scene.gravity = BABYLON.Vector3.Zero();
        this.scene.collisionsEnabled = true;
    }

}