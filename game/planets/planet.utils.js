"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetUtils {

    static HEIGHTMAP = {

        octaves: 6,
        noiseScale: 750,
        multiplyFrequencyBy: 1.8,
        multiplyAmplitudeBy: 0.5,
        pow: 3.5
    };

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
    
    static fractionalBrownianMotion( perlin, v ) {

        const xs = v.x / PlanetUtils.HEIGHTMAP.noiseScale;
        const ys = v.y / PlanetUtils.HEIGHTMAP.noiseScale;
        const zs = v.z / PlanetUtils.HEIGHTMAP.noiseScale;

        let total = 0;
        let frequency = 1.0;
        let normalization = 0;
        let amplitude = 1.0;

        for ( let o = 0; o < PlanetUtils.HEIGHTMAP.octaves; o++ ) {

            const noiseValue = perlin.get( xs * frequency, ys * frequency, zs * frequency );
            total += noiseValue * amplitude;
            
            frequency *= PlanetUtils.HEIGHTMAP.multiplyFrequencyBy;
            normalization += amplitude;
            amplitude *= PlanetUtils.HEIGHTMAP.multiplyAmplitudeBy;
        }
        
        total /= normalization;

        return Math.pow( total, PlanetUtils.HEIGHTMAP.pow );
    }

    static heightmap( planet, v ) {

        const perlin = planet.config.perlin;
        const fbm = PlanetUtils.fractionalBrownianMotion;
        const heightScale = planet.config.mountainy * 200;

        //https://github.com/dandrino/terrain-erosion-3-ways
        //https://starcitizenguidetothegalaxy.com/planet-modelling/

        const vOffset = v.add( planet.config.seed.scale( 0.001 ) );
        const fbmOffset = fbm( perlin, vOffset ); 
        const offset = planet.config.seed.scale( fbmOffset * 0.5 );
        //const offset = new BABYLON.Vector3( fbmOffset, -fbmOffset, -fbmOffset + 0.5 ).scaleInPlace( heightScale );

        return fbm( perlin, offset.addInPlace( v ) ) * heightScale;
    }

    static terrainify( planet, v ) {

        v = PlanetUtils.cubesphere( v, planet.config.radius );
        
        return PlanetUtils.displace( planet, v );
    }

    static displace( planet, v ) {
        
        let noise = PlanetUtils.heightmap( planet, v.scale( planet.config.radius ).addInPlace( planet.config.seed ) );
        
        return v.scaleInPlace( planet.config.radius + noise );
    }

}