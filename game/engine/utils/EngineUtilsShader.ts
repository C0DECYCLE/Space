"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class EngineUtilsShader {

    static code = ( async function() { const file = await fetch( "../game/engine/utils/engine.utils.shader.glsl" ); return await file.text(); } )();

    static registerInstanceAttribute( mesh, name, defaultValue ) {
        
        const arrayValue = [];

        defaultValue.toArray?.( arrayValue );
        
        mesh.registerInstancedBuffer( name, arrayValue.length || 1 );
        mesh.instancedBuffers[ name ] = defaultValue;
    }

    static setInstanceAttribute( instance, name, value ) {

        instance.instancedBuffers[ name ] = value;
    }

}