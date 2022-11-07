/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Singleton< T > implements ISingleton {

    protected static instance: Singleton< T >;

    private constructor() {

    }

    public static instantiate(): void {

        this.instance = new Singleton< T >();
    } 

    public static get i(): Singleton< T > {

        if ( this.instance === undefined ) {

            console.error( "Singleton: Not instantiated!" );
        }

        return this.instance;
    }

}