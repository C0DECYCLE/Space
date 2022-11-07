/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class Singleton implements ISingleton {

    protected static instance: ISingleton = new Singleton();

    public static get i(): ISingleton {

        return this.instance;
    }

    protected constructor() {

    }

}