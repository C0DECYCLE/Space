/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTargetPlayer extends CameraTarget implements ICameraTargetPlayer {

    public override config: IConfig = new Config(  

        [ "offset", new BABYLON.Vector3( 0, 1, 0 ) ],
        [ "offsetRadius", 8 ],

        [ "spaceFocusBeta", Math.PI / 2 ],
        [ "planetFocusBeta", Math.PI / 2.5 ],
    );
    
    private wasUnfocused: boolean = false;

    public constructor( camera: ICamera, config: IConfig ) {

        super( camera, config );
        
        EngineUtils.configure( this, config );
    }

    public override update( player: IPlayer ): void {

        this.adaptFocus( player );

        super.update( player );

        if ( this.camera.controls.isKeyboarding === true ) {

            this.refocus( player );
            this.focus();

        } else {

            this.wasUnfocused = true;
        }
    }

    public override onPointerMove( player: IPlayer, event: BABYLON.PointerInfo ): void {

        if ( this.camera.controls.isPointerDown === true || this.camera.controls.config.experimentalPointerLock === true ) {

            if ( this.camera.controls.isKeyboarding === true ) {

                this.followPointer( player, event );

            } else {

                this.free( event );
            }
        }
    }

    private adaptFocus( player: IPlayer ): void {

        if ( player.state.is( "space" ) === true ) {
            
            this.config.focusBeta = this.config.spaceFocusBeta;

        } else if ( player.state.is( "planet" ) === true ) {

            this.config.focusBeta = this.config.planetFocusBeta;
        }
    }

    private refocus( player: IPlayer ): void {

        if ( this.wasUnfocused === true ) {

            this.redirect( player );
            this.focus( 1.0 );

            this.wasUnfocused = false;
        }
    }

}