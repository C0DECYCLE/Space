/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Singleton implements ISingleton {

    protected static instance: ISingleton;

    public static instantiate(): void {

        this.instance = new this();
    } 

    public static get i(): ISingleton {

        if ( this.instance === undefined ) {

            console.error( "Singleton: Not instantiated!" );
        }

        return this.instance;
    }

}