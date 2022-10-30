/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainerUtils implements IObjectContainerUtils {

    public static positionToGrid( position: BABYLON.Vector3 ): BABYLON.Vector3 {

        return EngineUtils.round( position.scale( 1 / ObjectContainer.size ) );
    }

    public static gridToApproximatePosition( grid: BABYLON.Vector3 ): BABYLON.Vector3 {

        return grid.scale( ObjectContainer.size );
    }

    public static gridToIndex( input: BABYLON.Vector3 | number, y?: number, z?: number ): string {

        if ( input instanceof BABYLON.Vector3 ) {

            return `${ input.x },${ input.y },${ input.z }`;
        }

        if ( y !== undefined && z !== undefined ) {

            return `${ input },${ y },${ z }`;
        }

        console.error( "ObjectContainerUtils, gridToIndex: False input!" );
        return "";
    }

    public static indexToGrid( index: string ): BABYLON.Vector3 {

        const split: string[] = index.split( "," );

        return new BABYLON.Vector3( Number( split[0] ), Number( split[1] ), Number( split[2] ) );
    }

    public static positionToIndex( position: BABYLON.Vector3 ): string {

        return ObjectContainerUtils.gridToIndex( ObjectContainerUtils.positionToGrid( position ) );
    }

    public static indexToApproximatePosition( index: string ): BABYLON.Vector3 {

        return ObjectContainerUtils.gridToApproximatePosition( ObjectContainerUtils.indexToGrid( index ) );
    }

    public static getObjectContainer( node: BABYLON.Node ): IObjectContainer | null {
        
        if ( node.objectcontainer !== undefined ) {

            return node.objectcontainer;
        }

        if ( node.parent !== null ) {

            return ObjectContainerUtils.getObjectContainer( node.parent );
        }
        
        return null;
    }

}