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

        const mountainy = 7.5;

        if ( !window._p ) {
            window._p = {
                octaves: 6,
                noiseScale: 750,
                heightScale: mountainy * 200,
                multiplyFrequencyBy: 1.8,
                multiplyAmplitudeBy: 0.5,
                pow: 3.5,
            };
        }

        const xs = v.x / _p.noiseScale;
        const ys = v.y / _p.noiseScale;
        const zs = v.z / _p.noiseScale;

        let total = 0;
        let frequency = 1.0;
        let normalization = 0;
        let amplitude = 1.0;

        for ( let o = 0; o < _p.octaves; o++ ) {

            const noiseValue = planet.config.perlin.get( xs * frequency, ys * frequency, zs * frequency );

            total += noiseValue * amplitude;
            
            frequency *= _p.multiplyFrequencyBy;
            normalization += amplitude;
            amplitude *= _p.multiplyAmplitudeBy;
        }
        
        total /= normalization;

        return Math.pow( total, _p.pow ) * _p.heightScale;
    }

    static terrainify( v, planet ) {

        v = PlanetUtils.cubesphere( v, planet.config.radius );
        
        return PlanetUtils.displace( v, planet );
    }

    static displace( v, planet ) {
        
        let noise = PlanetUtils.heightmap( v.scale( planet.config.radius ).addInPlace( planet.config.seed ), planet );
        
        return v.scaleInPlace( planet.config.radius + noise );
    }

}