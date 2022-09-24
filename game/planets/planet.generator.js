"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetGenerator {

    #planet = null;

    constructor( planet, faces ) {
    
        this.#planet = planet;

        this.#createFaces( faces );
        this.#createMask();
        this.toggleMask( false );
        //this.#debugInfluence();
    }

    toggleMask( value ) {

        this.#planet.mask.setEnabled( value );
    }

    createMaterial() {
        
        const material = new BABYLON.StandardMaterial( `planet${ this.#planet.config.key }_material`, this.#planet.scene );
        material.setColorIntensity( "#534d5f", 1.0 );

        return material;
    }

    createCustomMaterial() {
        
        const material = new BABYLON.CustomMaterial( `planet${ this.#planet.config.key }_custumMaterial`, this.#planet.scene );
        
        const colorMain = new BABYLON.Color3.FromHexString( this.#planet.config.colorMain );
        const colorSteep = new BABYLON.Color3.FromHexString( this.#planet.config.colorSteep );
        
        material.specularColor = new BABYLON.Color3( 0, 0, 0 );
        material.emissiveColor = new BABYLON.Color3( 0, 0, 0 );
        material.ambientColor = new BABYLON.Color3( 0, 0, 0 );

        const ambient = this.#planet.scene.ambient;

        if ( typeof ambient !== "undefined" ) {

            colorMain.scale( ambient.intensity );
            colorSteep.scale( ambient.intensity );

            material.ambientColor = new BABYLON.Color3.FromHexString( ambient.color ).scale( ambient.materialFactor() );
        }
                
        material.AddUniform( "colorMain", "vec3" );
        material.AddUniform( "colorSteep", "vec3" );
        material.AddUniform( "planetCenter", "vec3" );
        material.AddUniform( "planetRotation", "vec3" );

        material.onBindObservable.add( () => { 

            material.getEffect().setVector3( "colorMain", new BABYLON.Vector3( colorMain.r, colorMain.g, colorMain.b ) );
            material.getEffect().setVector3( "colorSteep", new BABYLON.Vector3( colorSteep.r, colorSteep.g, colorSteep.b ) );
            material.getEffect().setVector3( "planetCenter", this.#planet.position );
            material.getEffect().setVector3( "planetRotation", this.#planet.rotationQuaternion.toEulerAngles().negateInPlace() );
        } );

        //this.material.Vertex_Begin( this._getVertexBegin() );
        material.Vertex_Definitions( `
        
            flat out vec3 flatDiffuseColor;

        ` );
        //this.material.Vertex_MainBegin( this._getVertexMainBegin() );
        //this.material.Vertex_Before_PositionUpdated( this._getVertexBeforePositionUpdated() );
        //this.material.Vertex_After_WorldPosComputed( this._getVertexAfterWorldPosComputed() );
        //this.material.Vertex_Before_NormalUpdated( this._getVertexBeforeNormalUpdated() );
        material.Vertex_MainEnd( `
        
            float steep = dot( normalize( position ), normal );
            
            if ( steep <= 0.9 ) {

                flatDiffuseColor = colorSteep;

            } else if ( steep > 0.9 && steep <= 0.933 ) {

                flatDiffuseColor = mix( colorSteep, colorMain, 0.33 );

            } else if ( steep > 0.933 && steep <= 0.966 ) {

                flatDiffuseColor = mix( colorSteep, colorMain, 0.66 );

            } else {

                flatDiffuseColor = colorMain;
            }

        ` );

        //this.material.Fragment_Begin( this._getFragmentBegin() );
        material.Fragment_Definitions( `
                
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

            float round( float x, float a ) {
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

            flat in vec3 flatDiffuseColor;
            
        ` );
        //this.material.Fragment_MainBegin( this._getFragmentMainBegin() ); 
        //this.material.Fragment_Before_Lights( this._getFragmentBeforeLights() );
        //this.material.Fragment_Before_Fog( this._getFragmentBeforeFog() );
        //this.material.Fragment_Before_FragColor( this._getFragmentBeforeFragColor() );
        material.Fragment_Custom_Diffuse( `
            
            /*
            vec3 positionPlanet = rotate( vPositionW - planetCenter, planetRotation );
            vec3 up = normalize( positionPlanet );
            float steep = dot( up, vNormalW );
            
            if ( steep <= 0.9 ) {

                diffuseColor = colorSteep;

            } else if ( steep > 0.9 && steep <= 0.933 ) {

                diffuseColor = mix( colorSteep, colorMain, 0.33 );

            } else if ( steep > 0.933 && steep <= 0.966 ) {

                diffuseColor = mix( colorSteep, colorMain, 0.66 );

            } else {

                diffuseColor = colorMain;
            }

            diffuseColor *= 0.25 + round( noise( ( positionPlanet + vNormalW ) * 0.01 ), 3.0 ) * 0.75;
            */

            diffuseColor = flatDiffuseColor;

        ` );
        //this.material.Fragment_Custom_Alpha( this._getFragmentCustomAlpha() );

        return material;
    }

    createChunkMesh( nodeKey, position, fixRotation, size, resolution, distance ) {
        //maybe switch to tiledplane?
        const mesh = BABYLON.MeshBuilder.CreateGround( `planet${ this.#planet.config.key }_chunk_${ nodeKey }`, { width: size, height: size, updatable: true, subdivisions: resolution }, this.#planet.scene );

        this.updateChunkMesh( mesh, position, fixRotation );

        mesh.material = this.#planet.material;
        mesh.parent = this.#planet.root;

        this.#planet.physics.enable( mesh, size );
        
        this.#planet.game.star.shadow.cast( mesh, undefined, undefined, false );        
        this.#planet.game.star.shadow.receive( mesh, undefined, undefined, false );  

        return mesh;
    }
    
    updateChunkMesh( mesh, position, fixRotation ) {
        
        const positions = mesh.getVerticesData( BABYLON.VertexBuffer.PositionKind );

        for ( let i = 0; i < positions.length / 3; i++ ) {
            
            let vertex = new BABYLON.Vector3( positions[ i * 3 ], positions[ i * 3 + 1 ], positions[ i * 3 + 2 ] );
            
            vertex.applyRotationQuaternionInPlace( fixRotation.toQuaternion() );
            vertex.addInPlace( position );
    
            vertex = PlanetUtils.terrainify( this.#planet, vertex );

            positions[ i * 3 ] = vertex.x;
            positions[ i * 3 + 1 ] = vertex.y;
            positions[ i * 3 + 2 ] = vertex.z;
        }
        
        mesh.updateVerticesData( BABYLON.VertexBuffer.PositionKind, positions );
        mesh.convertToFlatShadedMesh();
    }

    #createFaces( faces ) {

        const suffix = "UDFBLR";
        const rotations = [

            new BABYLON.Vector3( 0, 0, 0 ), //Up
            new BABYLON.Vector3( 2, 0, 0 ), //Down
            new BABYLON.Vector3( 1, 0, 0 ), //Forward
            new BABYLON.Vector3( -1, 0, 0 ), //Backward
            new BABYLON.Vector3( 0, 0, 1 ), //Left
            new BABYLON.Vector3( 0, 0, -1 ) //Right
        ];

        for ( let i = 0; i < rotations.length; i++ ) {

            faces.push( new PlanetQuadtree( this.#planet, suffix[i], rotations[i] ) );
        }
    }
    
    #createMask() {

        this.#planet.mask = BABYLON.MeshBuilder.CreateSphere( "planet_mask", { diameter: this.#planet.config.radius * 2, segments: 16 }, this.scene );
        this.#planet.mask.material = this.#planet.game.planets.getMaskMaterial();
        this.#planet.mask.parent = this.#planet.root;

        this.#planet.game.star.shadow.cast( this.#planet.mask, undefined, undefined, false );
    }

    #debugInfluence() {

        const debug_influence = BABYLON.MeshBuilder.CreateSphere( "planet_debug_influence", { diameter: ( this.#planet.config.radius + this.#planet.config.influence ) * 2, segments: 32 }, this.#planet.scene );
        debug_influence.material = this.#planet.scene.debugMaterialRed;
        debug_influence.parent = this.#planet.root;

        const debug_maxHeight = BABYLON.MeshBuilder.CreateSphere( "planet_debug_maxHeight", { diameter: ( this.#planet.config.radius + this.#planet.config.maxHeight ) * 2, segments: 32 }, this.#planet.scene );
        debug_maxHeight.material = this.#planet.scene.debugMaterialRed;
        debug_maxHeight.parent = this.#planet.root;
    }

}