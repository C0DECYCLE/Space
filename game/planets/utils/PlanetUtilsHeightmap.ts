/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetUtilsHeightmap implements IPlanetUtilsHeightmap {

    public static PARAMETERS = EPlanetUtilsHeightmapParameters;

    public static get( planet: IPlanet, vector: BABYLON.Vector3 ): number {

        //https://github.com/dandrino/terrain-erosion-3-ways
        //https://starcitizenguidetothegalaxy.com/planet-modelling/

        switch ( planet.config.variant ) {

            case "0": return PlanetUtilsHeightmap.variant0( planet, vector );
            case "1": return PlanetUtilsHeightmap.variant1( planet, vector );
        }

        return PlanetUtilsHeightmap.variant0( planet, vector );
    }
    
    public static variant0( planet: IPlanet, vector: BABYLON.Vector3 ): number {
        
        const fbm: ( perlin: perlinNoise3d, vector: BABYLON.Vector3 ) => number = PlanetUtilsHeightmap.fractionalBrownianMotion;
        const perlin: perlinNoise3d = planet.perlin;
        const heightScale: number = planet.config.mountainy * 200;
        const warp: number = planet.config.warp;

        const vOffset: BABYLON.Vector3 = vector.add( planet.config.seed.scale( 0.001 ) );
        const offset: BABYLON.Vector3 = planet.config.seed.scale( fbm( perlin, vOffset ) * warp );

        return fbm( perlin, offset.addInPlace( vector ) ) * heightScale;
    }

    public static variant1( planet: IPlanet, vector: BABYLON.Vector3 ): number {

        const fbm: ( perlin: perlinNoise3d, vector: BABYLON.Vector3 ) => number = PlanetUtilsHeightmap.fractionalBrownianMotion;
        const perlin: perlinNoise3d = planet.perlin;
        const heightScale: number = planet.config.mountainy * 200;
        const warp: number = planet.config.warp;

        const vOffset: BABYLON.Vector3 = vector.add( planet.config.seed.scale( 0.001 ) );
        const fbmOffset: number = fbm( perlin, vOffset ); 
        const offset: BABYLON.Vector3 = new BABYLON.Vector3( fbmOffset * 2 - 1, Math.sin( fbmOffset * 10 ), Math.cos( fbmOffset * 10 ) ).scaleInPlace( heightScale * warp );

        return fbm( perlin, offset.addInPlace( vector ) ) * heightScale;
    }

    public static fractionalBrownianMotion( perlin: perlinNoise3d, vector: BABYLON.Vector3 ): number {

        const xs: number = vector.x / PlanetUtilsHeightmap.PARAMETERS.noiseScale;
        const ys: number = vector.y / PlanetUtilsHeightmap.PARAMETERS.noiseScale;
        const zs: number = vector.z / PlanetUtilsHeightmap.PARAMETERS.noiseScale;

        let total: number = 0;
        let frequency: number = 1.0;
        let normalization: number = 0;
        let amplitude: number = 1.0;

        for ( let o: number = 0; o < PlanetUtilsHeightmap.PARAMETERS.octaves; o++ ) {

            const noiseValue: number = perlin.get( xs * frequency, ys * frequency, zs * frequency );
            total += noiseValue * amplitude;
            
            frequency *= PlanetUtilsHeightmap.PARAMETERS.multiplyFrequencyBy;
            normalization += amplitude;
            amplitude *= PlanetUtilsHeightmap.PARAMETERS.multiplyAmplitudeBy;
        }
        
        total /= normalization;

        return Math.pow( total, PlanetUtilsHeightmap.PARAMETERS.pow );
    }
    
}