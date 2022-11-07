/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Physics implements IPhysics {

    /* Singleton */ 
    private static instance: IPhysics; 
    public static instantiate(): void { if ( this.instance === undefined ) this.instance = new Physics(); } 
    public static getInstance(): IPhysics { return this.instance; }

    public config: IConfig = new Config(  

    );

    public get isPaused(): boolean {
        
        return this.isPausedValue;
    }

    private isPausedValue: boolean = false;

    private constructor() {

        this.setupCollisions();
    }

    public pause(): void {

        this.isPausedValue = true;
    }

    public resume(): void {

        this.isPausedValue = false;
    }
    
    private setupCollisions(): void {

        Space.scene.gravity = BABYLON.Vector3.Zero();
        Space.scene.collisionsEnabled = true;
    }

}