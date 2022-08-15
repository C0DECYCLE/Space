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

        /*
        const N_OCTAVES = 5;
        const P_FACTOR = planet.config.radius / 2048;

        let frequency = 3.5 * P_FACTOR; //2.5
        let amplitude = 0.5; //0.5
        
        const lacunarity = 3.0; //2.0
        const persistence = 0.3; //0.5

        let n = 0;

        for ( let octave = 0; octave < N_OCTAVES; octave++ ) {
            
            n += amplitude * planet.config.perlin.get( frequency * v.x, frequency * v.y, frequency * v.z ); //genericNoise3d

            frequency *= lacunarity;
            amplitude *= persistence; 
        }
        
        return n.clamp( 0.0, Infinity );
        */

        let _params = {
            octaves: 13,
            persistence: 10.5,
            lacunarity: 1.6,
            exponentiation: 7.5,
            height: 100,
            scale: 1000,
            seed: 1
        };

        const G = 2.0 ** (-_params.persistence);
        const xs = v.x / _params.scale;
        const ys = v.y / _params.scale;
        const zs = v.z / _params.scale;
        const noiseFunc = planet.config.perlin.get;

        let amplitude = 1.0;
        let frequency = 1.0;
        let normalization = 0;
        let total = 0;
        for (let o = 0; o < _params.octaves; o++) {
            const noiseValue = noiseFunc(
            xs * frequency, ys * frequency, zs * frequency) * 0.5 + 0.5;

            total += noiseValue * amplitude;
            normalization += amplitude;
            amplitude *= G;
            frequency *= _params.lacunarity;
        }
        total /= normalization;
        return Math.pow(
            total, _params.exponentiation) * _params.height;
    }

    static terrainify( v, planet ) {

        v = PlanetUtils.cubesphere( v, planet.config.radius );
        
        return PlanetUtils.displace( v, planet );
    }

    static displace( v, planet ) {

        let i = planet.config.seed.add( v );
        let noise = PlanetUtils.heightmap( i, planet );
        
        return v.scaleInPlace( planet.config.radius + noise );
    }

}