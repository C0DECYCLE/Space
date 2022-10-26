/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class LoadConfig implements ILoadConfig {

    public readonly key: string;
    public readonly path: string;

    constructor( key: ILoadConfig[ "key" ], path: ILoadConfig[ "path" ] ) {

        this.key = key;
        this.path = path;
    }
    
}