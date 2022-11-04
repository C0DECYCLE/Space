/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Spaceship implements ISpaceship {

    public config: IConfig = new Config(  

        [ "key", UUIDv4() ],

        [ "landingAngle", 45 * EngineUtils.toRadian ],
        [ "upLerp", 0.1 ]
    );

    public readonly game: IGame;
    public readonly scene: BABYLON.Scene;
    public readonly spaceships: ISpaceships;

    public lod: ILOD;
    public travel: ISpaceshipTravel;
    public physics: ISpaceshipPhysics;
    public thrusters?: ISpaceshipThrusters;

    public get root(): BABYLON.TransformNode {

        return this.lod.root;
    }

    public get position(): BABYLON.Vector3 {
        
        return this.lod.position;
    }

    public get rotationQuaternion(): BABYLON.Quaternion {
        
        return this.lod.rotationQuaternion;
    }

    public get hasController(): boolean {

        return this.hasControllerValue;
    }

    public get nearPlanet(): IPlanet | false {

        return this.nearPlanetValue || false;
    }

    public get isLanded(): boolean {

        return this.isLandedValue;
    }

    private readonly seatDiffrence: BABYLON.Vector3 = new BABYLON.Vector3();
    private hasControllerValue: boolean = false;
    private nearPlanetValue?: IPlanet;
    private isLandedValue: boolean = false;

    protected constructor( game: IGame, models: IModels, config: IConfig ) {

        this.game = game;
        this.scene = this.game.scene;
        this.spaceships = this.game.spaceships;
        
        EngineUtils.configure( this, config );
        
        this.createLod( models );   
        this.setupTravel();
        this.addPhysics();
        this.registerInteractable();
    }
    
    public post(): void {

        this.addThrusters();
    }

    public update(): void {

        this.lod.update();
        this.travel.update();
        this.physics.update();

        if ( this.thrusters !== undefined ) {
            
            this.thrusters.update();
        }
    }

    public planetInsert( planet: IPlanet, distance: number, planetThreashold: number ): void {

        if ( distance <= planetThreashold && this.nearPlanet === false ) {

            this.nearPlanetValue = planet;
        }

        if ( this.nearPlanet !== false && PlanetUtils.compare( this.nearPlanet, planet ) && distance > planetThreashold ) {

            this.nearPlanetValue = undefined;
        }
    }

    public enter( player: IPlayer ): void {

        this.rememberSeat( player );
        this.hasControllerValue = true;
    }

    public leave( player: IPlayer ): void {

        this.hasControllerValue = false;
        this.putOutOfSeat( player );
    }

    public land(): void {

        this.isLandedValue = true;
    }

    public takeoff(): void {

        this.isLandedValue = false;
    }

    private createLod( model: IModels ): void {

        this.lod = new LOD( this.game, ( instance: BABYLON.TransformNode, value: boolean ): void => { 

            if ( instance instanceof BABYLON.AbstractMesh ) {

                this.game.star.shadow.cast( instance, true, value ); 
            }
        } );

        this.lod.fromModels( model, ( _instance: BABYLON.InstancedMesh, _level: number ): void => {} );

        this.root.name = `spaceships_spaceship${ this.config.key }`;

        this.game.ui.registerMarker( this.root, new Config( [ "type", "hint" ] ) );
    }

    private setupTravel(): void {
        
        this.travel = new SpaceshipTravel( this );
    }

    private addThrusters(): void {
        
        this.thrusters = new SpaceshipThrusters( this, this.config.thrusters );
    }

    private addPhysics(): void {

        this.physics = new SpaceshipPhysics( this );
    }

    private registerInteractable(): void {
        
        const cockpit: BABYLON.AbstractMesh = this.root.getChildMeshes( false, ( mesh: BABYLON.Node ): boolean => mesh.name.split( "i-" )[1] == "glass" )[0];

        if ( cockpit instanceof BABYLON.InstancedMesh ) {

            this.game.player.interaction.register( cockpit, (): void => {
    
                this.game.player.state.set( "spaceship", this );
    
            }, (): void => {
    
                this.game.player.state.set( "space" );
            } );
        }
    }

    private rememberSeat( player: IPlayer ): void {

        this.seatDiffrence.copyFrom( this.position ).subtractInPlace( player.position ).applyRotationQuaternionInPlace( this.rotationQuaternion.invert() );
    }

    private putOutOfSeat( player: IPlayer ): void {

        player.position.copyFrom( this.position ).subtractInPlace( this.seatDiffrence.applyRotationQuaternionInPlace( this.rotationQuaternion ) );
    }

}