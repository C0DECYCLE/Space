/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetUtilsHeightmap implements IPlanetUtilsHeightmap {

    public static VARIANTS = EPlanetUtilsHeightmapVariants;
    public static PARAMETERS = EPlanetUtilsHeightmapParameters;

    public static get( planet: IPlanet, vector: BABYLON.Vector3 ): float {

        //https://github.com/dandrino/terrain-erosion-3-ways
        //https://starcitizenguidetothegalaxy.com/planet-modelling/

        switch ( planet.config.variant ) {

            case PlanetUtilsHeightmap.VARIANTS.DEFAULT: return PlanetUtilsHeightmap.variantDefault( planet, vector );
            case PlanetUtilsHeightmap.VARIANTS.SWIRL: return PlanetUtilsHeightmap.variantSwirl( planet, vector );
        }

        return PlanetUtilsHeightmap.variantDefault( planet, vector );
    }
    
    public static variantDefault( planet: IPlanet, vector: BABYLON.Vector3 ): float {
        
        const fbm: ( perlin: perlinNoise3d, vector: BABYLON.Vector3 ) => float = PlanetUtilsHeightmap.fractionalBrownianMotion;
        const perlin: perlinNoise3d = planet.perlin;
        const heightScale: float = planet.config.mountainy * 200;
        const warp: float = planet.config.warp;

        const vOffset: BABYLON.Vector3 = vector.add( planet.config.seed.scale( 0.001 ) );
        const offset: BABYLON.Vector3 = planet.config.seed.scale( fbm( perlin, vOffset ) * warp );

        return fbm( perlin, offset.addInPlace( vector ) ) * heightScale;
    }

    public static variantSwirl( planet: IPlanet, vector: BABYLON.Vector3 ): float {

        const fbm: ( perlin: perlinNoise3d, vector: BABYLON.Vector3 ) => float = PlanetUtilsHeightmap.fractionalBrownianMotion;
        const perlin: perlinNoise3d = planet.perlin;
        const heightScale: float = planet.config.mountainy * 200;
        const warp: float = planet.config.warp;

        const vOffset: BABYLON.Vector3 = vector.add( planet.config.seed.scale( 0.001 ) );
        const fbmOffset: float = fbm( perlin, vOffset ); 
        const offset: BABYLON.Vector3 = new BABYLON.Vector3( fbmOffset * 2 - 1, Math.sin( fbmOffset * 10 ), Math.cos( fbmOffset * 10 ) ).scaleInPlace( heightScale * warp );

        return fbm( perlin, offset.addInPlace( vector ) ) * heightScale;
    }

    public static fractionalBrownianMotion( perlin: perlinNoise3d, vector: BABYLON.Vector3 ): float {

        const xs: float = vector.x / PlanetUtilsHeightmap.PARAMETERS.noiseScale;
        const ys: float = vector.y / PlanetUtilsHeightmap.PARAMETERS.noiseScale;
        const zs: float = vector.z / PlanetUtilsHeightmap.PARAMETERS.noiseScale;

        let total: float = 0.0;
        let frequency: float = 1.0;
        let normalization: float = 0.0;
        let amplitude: float = 1.0;

        for ( let o: int = 0; o < PlanetUtilsHeightmap.PARAMETERS.octaves; o++ ) {

            const noiseValue: float = perlin.get( xs * frequency, ys * frequency, zs * frequency );
            total += noiseValue * amplitude;
            
            frequency *= PlanetUtilsHeightmap.PARAMETERS.multiplyFrequencyBy;
            normalization += amplitude;
            amplitude *= PlanetUtilsHeightmap.PARAMETERS.multiplyAmplitudeBy;
        }
        
        total /= normalization;

        return Math.pow( total, PlanetUtilsHeightmap.PARAMETERS.pow );
    }
    
}