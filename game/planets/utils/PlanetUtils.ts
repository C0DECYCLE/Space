/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetUtils implements IPlanetUtils {

    public static compare( planetA: IPlanet, planetB: IPlanet ): boolean {

        return planetA.config.key === planetB.config.key;
    }

    public static terrainify( planet: IPlanet, vector: BABYLON.Vector3 ): BABYLON.Vector3 {

        PlanetUtils.cubesphere( vector, planet.config.radius );
        
        return PlanetUtils.displace( planet, vector );
    }

    public static cubesphere( v: BABYLON.Vector3, r: number ): BABYLON.Vector3 {
        
        v.scaleInPlace( 1 / r );
        
        const x2 = v.x * v.x;
        const y2 = v.y * v.y;
        const z2 = v.z * v.z;
        
        v.x *= Math.sqrt( 1 - y2 / 2 - z2 / 2 + y2 * z2 / 3 );
        v.y *= Math.sqrt( 1 - x2 / 2 - z2 / 2 + x2 * z2 / 3 );
        v.z *= Math.sqrt( 1 - x2 / 2 - y2 / 2 + x2 * y2 / 3 );
        
        return v;
    }

    public static noise( planet: IPlanet, vector: BABYLON.Vector3 ): number {

        return PlanetUtilsHeightmap.get( planet, vector.scale( planet.config.radius ).addInPlace( planet.config.seed ) ).clamp( 0, planet.config.maxHeight );
    }
    
    public static displace( planet: IPlanet, vector: BABYLON.Vector3 ): BABYLON.Vector3 {
        
        return vector.scaleInPlace( planet.config.radius + PlanetUtils.noise( planet, vector ) );
    }

}