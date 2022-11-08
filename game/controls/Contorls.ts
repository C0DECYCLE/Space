/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Controls implements IControls {

    /* Singleton */ 
    private static instance: IControls; 
    public static instantiate(): void { if ( this.instance === undefined ) this.instance = new Controls(); } 
    public static getInstance(): IControls { return this.instance; }

    public static readonly KEYS = EControlsKeys;

    public config: IConfig = {
        
        panning: 0.005,
    
        experimentalPointerLock: true
    };
    
    public readonly activeKeys: Set< string > = new Set< string >();

    public readonly onPointerDown: Set< TPointerEvent > = new Set< TPointerEvent >();
    public readonly onPointerUp: Set< TPointerEvent > = new Set< TPointerEvent >();
    public readonly onPointerMove: Set< TPointerEvent > = new Set< TPointerEvent >();

    public get isKeyboarding(): boolean {

        return this.isUsingKeyboard;
    }

    public get isPointerDown(): boolean {

        return this.isDowningPointer;
    }

    private isUsingKeyboard: boolean = false;
    private isDowningPointer: boolean = false;

    private constructor() {

        this.bindKeyboard();
        this.bindMouse();
    }

    private bindKeyboard(): void {

        scene.onKeyboardObservable.add( ( kbInfo: BABYLON.KeyboardInfo ): void => this.onKeyboardObservable( kbInfo ) );
    }

    private onKeyboardObservable( kbInfo: BABYLON.KeyboardInfo ): void {

        if ( kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN ) {
                
            this.activeKeys.add( kbInfo.event.key.toLowerCase() );

        } else if ( kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP ) {

            this.activeKeys.delete( kbInfo.event.key.toLowerCase() );
        }

        this.isUsingKeyboard = this.activeKeys.size > 0;
    }

    private bindMouse(): void {

        scene.onPointerObservable.add( ( pointerInfo: BABYLON.PointerInfo ): void => this.onPointerObservable( pointerInfo ) );

        if ( this.config.experimentalPointerLock === true ) {

            this.pointerLock();
        }
    }

    private onPointerObservable( pointerInfo: BABYLON.PointerInfo ): void {

        if ( pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN ) {

            this.isDowningPointer = true;
            this.onPointerDown.forEach( ( event: TPointerEvent ): void => event( pointerInfo ) );

        } else if ( pointerInfo.type === BABYLON.PointerEventTypes.POINTERUP ) {

            this.isDowningPointer = false;
            this.onPointerUp.forEach( ( event: TPointerEvent ): void => event( pointerInfo ) );

        } else if ( pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE && this.config.experimentalPointerLock === false ) {

            this.onPointerMove.forEach( ( event: TPointerEvent ): void => event( pointerInfo ) );
        }
    }

    private pointerLock(): void {

        const canvas: HTMLCanvasElement  = Engine.getInstance().canvas;
        const mouseMove: ( event: MouseEvent ) => void = ( event: MouseEvent ): void =>  {

            const pointerInfo: BABYLON.PointerInfo = new BABYLON.PointerInfo( BABYLON.PointerEventTypes.POINTERMOVE, event, null );
            
            this.onPointerMove.forEach( ( event: TPointerEvent ): void => event( pointerInfo ) );
        };  

        const changeCallback: ( event: Event ) => void = ( _event: Event ): void => {

            if ( document.pointerLockElement === canvas ) {

                document.addEventListener( "mousemove", mouseMove, false );

            } else {
                
                document.removeEventListener( "mousemove", mouseMove, false );
            }
        };

        document.addEventListener( "pointerlockchange", changeCallback, false );
        document.addEventListener( "mozpointerlockchange", changeCallback, false );
        document.addEventListener( "webkitpointerlockchange", changeCallback, false );

        canvas.onclick = (): void => {

            canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            canvas.requestPointerLock();
        };
    }

}