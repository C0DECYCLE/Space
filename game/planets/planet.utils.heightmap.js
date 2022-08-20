"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetUtilsHeightmap {

    static PARAMETERS = {

        octaves: 6,
        noiseScale: 750,
        multiplyFrequencyBy: 1.8,
        multiplyAmplitudeBy: 0.5,
        pow: 3.5
    };

    static get( planet, v ) {

        //https://github.com/dandrino/terrain-erosion-3-ways
        //https://starcitizenguidetothegalaxy.com/planet-modelling/

        return PlanetUtilsHeightmap[ `variant${ planet.config.variant }` ]( planet, v );
    }
    
    static variant0( planet, v ) {
        
        const perlin = planet.perlin;
        const fbm = PlanetUtilsHeightmap.fractionalBrownianMotion;
        const heightScale = planet.config.mountainy * 200;
        const warp = planet.config.warp;

        const vOffset = v.add( planet.config.seed.scale( 0.001 ) );
        const offset = planet.config.seed.scale( fbm( perlin, vOffset ) * warp );

        return fbm( perlin, offset.addInPlace( v ) ) * heightScale;
    }

    static variant1( planet, v ) {

        const perlin = planet.perlin;
        const fbm = PlanetUtilsHeightmap.fractionalBrownianMotion;
        const heightScale = planet.config.mountainy * 200;
        const warp = planet.config.warp;

        const vOffset = v.add( planet.config.seed.scale( 0.001 ) );
        const fbmOffset = fbm( perlin, vOffset ); 
        const offset = new BABYLON.Vector3( fbmOffset * 2 - 1, Math.sin( fbmOffset * 10 ), Math.cos( fbmOffset * 10 ) ).scaleInPlace( heightScale * warp );

        return fbm( perlin, offset.addInPlace( v ) ) * heightScale;
    }

    static fractionalBrownianMotion( perlin, v ) {

        const xs = v.x / PlanetUtilsHeightmap.PARAMETERS.noiseScale;
        const ys = v.y / PlanetUtilsHeightmap.PARAMETERS.noiseScale;
        const zs = v.z / PlanetUtilsHeightmap.PARAMETERS.noiseScale;

        let total = 0;
        let frequency = 1.0;
        let normalization = 0;
        let amplitude = 1.0;

        for ( let o = 0; o < PlanetUtilsHeightmap.PARAMETERS.octaves; o++ ) {

            const noiseValue = perlin.get( xs * frequency, ys * frequency, zs * frequency );
            total += noiseValue * amplitude;
            
            frequency *= PlanetUtilsHeightmap.PARAMETERS.multiplyFrequencyBy;
            normalization += amplitude;
            amplitude *= PlanetUtilsHeightmap.PARAMETERS.multiplyAmplitudeBy;
        }
        
        total /= normalization;

        return Math.pow( total, PlanetUtilsHeightmap.PARAMETERS.pow );
    }
    
}