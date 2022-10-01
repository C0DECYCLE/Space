"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EngineUtilsShader {

    static code = `

        float mod289( float x ) { return x - floor( x * (1.0 / 289.0) ) * 289.0; }
        vec4 mod289( vec4 x ) { return x - floor( x * (1.0 / 289.0) ) * 289.0; }
        vec4 perm( vec4 x ) { return mod289( ((x * 34.0) + 1.0) * x ); }
        
        float noise( vec3 p ){ //sync with JS version in PlanetShared
            vec3 a = floor(p);
            vec3 d = p - a;
            d = d * d * (3.0 - 2.0 * d);
            vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
            vec4 k1 = perm(b.xyxy);
            vec4 k2 = perm(k1.xyxy + b.zzww);
            vec4 c = k2 + a.zzzz;
            vec4 k3 = perm(c);
            vec4 k4 = perm(c + 1.0);
            vec4 o1 = fract(k3 * (1.0 / 41.0));
            vec4 o2 = fract(k4 * (1.0 / 41.0));
            vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
            vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
            return o4.y * d.y + o4.x * (1.0 - d.y);
        }

        float roundf( float x, float a ) {
            x *= a;
            float d = floor( x );
            if ( x - d < 0.5 ) {
                return d / a;
            } else {
                return ( d + 1.0 ) / a;
            }
        }

        vec3 rotateX(vec3 v, float angle) {
            return mat3( 1.0, 0.0, 0.0, 0.0, cos(angle), sin(angle), 0.0, -sin(angle), cos(angle) ) * v;
        }

        vec3 rotateY(vec3 v, float angle) {
            return mat3( cos(angle), 0.0, -sin(angle), 0.0, 1.0, 0.0, sin(angle), 0.0, cos(angle) ) * v;
        }

        vec3 rotateZ(vec3 v, float angle) {
            return mat3( cos(angle), sin(angle), 0.0, -sin(angle), cos(angle), 0.0, 0.0, 0.0, 1.0 ) * v;
        }

        vec3 rotate( vec3 target, vec3 angles ) {
            return rotateZ( rotateY( rotateX( target, angles.x ), angles.y ), angles.z );
        }

    `;

    static customInstanceDefault = 1;
    static customkeyMap = [ "r", "g", "b", "a" ];

    static enableCustomInstance( mesh ) {

        const d = EngineUtilsShader.customInstanceDefault;

        mesh.registerInstancedBuffer( "color", 4 );
        mesh.instancedBuffers.color = new BABYLON.Color4( d, d, d, d );
    }

    static setCustomInstance( instance, key, value ) {

        instance.instancedBuffers.color[ EngineUtilsShader.customkeyMap[ key ] ] = EngineUtilsShader.fetchCustomInstanceValue( value );
    }

    static fetchCustomInstanceValue( value ) {

        return EngineUtilsShader.customInstanceDefault + ( Number( value ) || 0 );
    }

    static parseCustomInstanceKey( key ) {

        return `roundf( vColor.${ EngineUtilsShader.customkeyMap[ key ] }, 1000000.0 )`;
    }

    static parseCustomInstanceValue( value ) {

        const fetch = EngineUtilsShader.fetchCustomInstanceValue( value ).toString();

        return fetch.includes( "." ) === true ? fetch : `${ fetch }.0`;
    }

}