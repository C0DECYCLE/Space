/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class AbstractLOD implements IAbstractLOD {

    public static readonly minimum: number = 0.01;

    public static getMinimum( name: string ): number {

        return Number( name.split( "_" )[2] ).clamp( AbstractLOD.minimum, Infinity );
    }

    public readonly game: IGame;
    public readonly levels: [ any, number ][] = [];

    public get isEnabled(): boolean {

        return this.enabled;
    }

    public get isVisible(): boolean {
    
        return this.currentLevel !== undefined;
    }

    protected enabled: boolean = true;

    protected coverage: number;
    protected currentLevel?: number;
    protected lastValidLevel: number = 0;

    protected constructor( game: IGame ) {

        this.game = game;
    }

    public add( level: any, min: number ): void {

        this.levels.push( [ level, min ] );
    }

    public setEnabled( value: boolean ): void {

        this.set( value === true ? this.lastValidLevel : -1 );
    }

    public set( level: number ): void {

        this.setLevel( level );
        this.enabled = this.isVisible;
    }

    protected disposeCurrent( _currentLevel: number ): void {

        this.currentLevel = undefined;
    }

    protected makeCurrent( level: number ): void {

        this.currentLevel = level;
        this.lastValidLevel = this.currentLevel;
    }

    protected setLevel( level: number ): void {

        if ( level !== this.currentLevel ) {

            if ( typeof this.currentLevel === "number" ) {
                
                this.disposeCurrent( this.currentLevel );
            }

            this.makeCurrent( level );
        }
    }

    protected getLevelFromCoverage( coverage: number ): number {

        for ( let i = 0; i < this.levels.length; i++ ) {

            if ( ( i - 1 < 0 ? coverage <= Infinity : coverage < this.levels[ i - 1 ][1] ) && coverage >= this.levels[i][1] ) {

                return i;
            }
        }

        return this.levels.length - 1;
    }

}