/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class PlanetQuadtree implements IPlanetQuadtree {

    public static readonly divisionSizeFactor: number = 1.2;

    public static readonly INSERT_HALF_LIMIT: number = 2 ** 4;
    public static readonly INSERT_LIMIT: number = PlanetQuadtree.INSERT_HALF_LIMIT + 2 ** 5;

    public readonly planet: IPlanet;
    public readonly suffix: string;

    private readonly size: number;
    private readonly fixRotationQuaternion: BABYLON.Quaternion;

    private up: BABYLON.Vector3;
    private left: BABYLON.Vector3;
    private right: BABYLON.Vector3;
    private forward: BABYLON.Vector3;
    private backward: BABYLON.Vector3;

    private leftforward: BABYLON.Vector3;
    private rightforward: BABYLON.Vector3;
    private leftbackward: BABYLON.Vector3;
    private rightbackward: BABYLON.Vector3;

    public constructor( planet: IPlanet, suffix: string, fixRotation: BABYLON.Vector3 ) {
    
        this.planet = planet;
        this.suffix = suffix;

        this.size = this.planet.config.radius * 2;
        this.fixRotationQuaternion = fixRotation.scaleInPlace( Math.PI / 2 ).toQuaternion();

        this.setup1D();
        this.setup2D();
    }

    public insert( params: IPlanetInsertParameters ): void {

        this.recurse( params, this.suffix, this.up.scale( this.planet.config.radius ), this.size );
    }

    private recurse( params: IPlanetInsertParameters, nodeKey: string, position: BABYLON.Vector3, size: number ): void {

        const factors: [ number, number ] = this.getDistanceDot( params, position );
        
        if ( factors[0] < (size * PlanetQuadtree.divisionSizeFactor) ** 2 && size > this.planet.config.min ) {

            this.recurseQuad( params, nodeKey, position, size );
            
        } else {

            this.planet.chunks.node( params, factors[0], nodeKey, position, this.fixRotationQuaternion, size, this.size );
        }
    }

    private recurseQuad( params: IPlanetInsertParameters, nodeKey: string, position: BABYLON.Vector3, size: number ): void {

        this.recurse( params, `${ nodeKey }0`, this.leftforward.scale( size / 4 ).addInPlace( position ), size / 2 );
        this.recurse( params, `${ nodeKey }1`, this.rightforward.scale( size / 4 ).addInPlace( position ), size / 2 );
        this.recurse( params, `${ nodeKey }2`, this.leftbackward.scale( size / 4 ).addInPlace( position ), size / 2 );
        this.recurse( params, `${ nodeKey }3`, this.rightbackward.scale( size / 4 ).addInPlace( position ), size / 2 );
    }

    private getDistanceDot( params: IPlanetInsertParameters, position: BABYLON.Vector3 ): [ number, number ] {

        const terrainifyPosition: BABYLON.Vector3 = PlanetUtils.terrainify( this.planet, position.clone() );
        const terrainifyWorldRotatePosition: BABYLON.Vector3 = BABYLON.Vector3.TransformCoordinates( terrainifyPosition, this.planet.root._worldMatrix );
        
        return [
            this.planet.game.camera.getScreenSquaredDistance( terrainifyWorldRotatePosition ),
            BABYLON.Vector3.Dot( params.centerToInsertion, terrainifyWorldRotatePosition.subtract( this.planet.position ).normalize() )
        ];
    }

    private setup1D(): void {

        this.right = BABYLON.Vector3.Right().applyRotationQuaternionInPlace( this.fixRotationQuaternion );
        this.up = BABYLON.Vector3.Up().applyRotationQuaternionInPlace( this.fixRotationQuaternion );
        
        this.forward = BABYLON.Vector3.Cross( this.right, this.up );
        this.left = this.right.negate();
        this.backward = this.forward.negate();
    }

    private setup2D(): void {

        this.leftforward = this.left.add( this.forward );
        this.rightforward = this.right.add( this.forward );
        this.leftbackward = this.backward.add( this.left );
        this.rightbackward = this.backward.add( this.right );
    }

}