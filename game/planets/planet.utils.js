"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetUtils {

    static compare( planetA, planetB ) {

        return planetA.config.key === planetB.config.key;
    }

    static terrainify( planet, v ) {

        v = PlanetUtils.cubesphere( v, planet.config.radius );
        
        return PlanetUtils.displace( planet, v );
    }

    static cubesphere( v, r ) {
        
        v.scaleInPlace( 1 / r );
        
        const x2 = v._x * v._x;
        const y2 = v._y * v._y;
        const z2 = v._z * v._z;
        
        const s = { x: 0, y: 0, z: 0 };
        
        s.x = v._x * Math.sqrt( 1 - y2 / 2 - z2 / 2 + y2 * z2 / 3 );
        s.y = v._y * Math.sqrt( 1 - x2 / 2 - z2 / 2 + x2 * z2 / 3 );
        s.z = v._z * Math.sqrt( 1 - x2 / 2 - y2 / 2 + x2 * y2 / 3 );
        
        v._x = s.x;
        v._y = s.y;
        v._z = s.z;
        
        return v;
    }

    static noise( planet, v ) {

        return PlanetUtilsHeightmap.get( planet, v.scale( planet.config.radius ).addInPlace( planet.config.seed ) ).clamp( 0, planet.config.maxHeight );
    }
    
    static displace( planet, v ) {
        
        return v.scaleInPlace( planet.config.radius + PlanetUtils.noise( planet, v ) );
    }

}