"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetUtils {

    static cubesphere( v, r ) {
        
        v.scaleInPlace( 1 / r );
        
        let x2 = v._x * v._x;
        let y2 = v._y * v._y;
        let z2 = v._z * v._z;
        
        let s = { x: 0, y: 0, z: 0 };
        
        s.x = v._x * Math.sqrt( 1 - y2 / 2 - z2 / 2 + y2 * z2 / 3 );
        s.y = v._y * Math.sqrt( 1 - x2 / 2 - z2 / 2 + x2 * z2 / 3 );
        s.z = v._z * Math.sqrt( 1 - x2 / 2 - y2 / 2 + x2 * y2 / 3 );
        
        v._x = s.x;
        v._y = s.y;
        v._z = s.z;
    
        s = null;
        
        return v;
    }

    static heightmap( v, planet ) {

        //https://github.com/simondevyoutube/ProceduralTerrain_Part8/blob/master/src/terrain-constants.js
        //https://github.com/simondevyoutube/ProceduralTerrain_Part8/blob/master/src/terrain.js
        //https://github.com/simondevyoutube/ProceduralTerrain_Part8/blob/master/src/noise.js

        const N_OCTAVES = 5;
        const P_FACTOR = planet.config.radius / 2048;

        let frequency = 3.5 * P_FACTOR; //2.5
        let amplitude = 0.5; //0.5
        
        const lacunarity = 3.0; //2.0
        const persistence = 0.3; //0.5
        
        const minimum = 0.4;

        let n = 0;

        for ( let octave = 0; octave < N_OCTAVES; octave++ ) {
            
            n += amplitude * planet.config.perlin.get( frequency * v.x, frequency * v.y, frequency * v.z ); //genericNoise3d

            frequency *= lacunarity;
            amplitude *= persistence; 
        }
        
        let mn = genericNoise3d( v.x * 2, v.y * 2, v.z * 2 ) * 0.35;
        mn += planet.config.perlin.get( v.x * 10, v.y * 10, v.z * 10 ) * 0.35; //genericNoise3d
        mn += genericNoise3d( v.x * 500, v.y * 500, v.z * 500 ) * 0.005;
        
        return n.clamp( minimum - 0.1 + ( mn * 0.2 * P_FACTOR ), Infinity );
    }

    static terrainify( v, planet ) {

        v = PlanetUtils.cubesphere( v, planet.config.radius );
        
        return PlanetUtils.displace( v, planet );
    }

    static displace( v, planet ) {

        let i = planet.config.seed.add( v );
        let noise = PlanetUtils.heightmap( i, planet );
        
        return v.scaleInPlace( planet.config.radius * ( 1 + noise ) * 0.75 );
    }

}