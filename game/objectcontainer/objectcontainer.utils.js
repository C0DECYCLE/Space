"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class ObjectContainerUtils {

    static positionToGrid( position ) {

        return EngineUtils.round( position.scale( 1 / ObjectContainer.size ) );
    }

    static gridToApproximatePosition( grid ) {

        return grid.scale( ObjectContainer.size );
    }

    static gridToIndex( grid, y, z ) {

        if ( typeof grid === "number" ) {

            return `${ grid },${ y },${ z }`;

        } else {

            return `${ grid.x },${ grid.y },${ grid.z }`;
        }
    }

    static indexToGrid( index ) {

        const split = index.split( "," );

        return new BABYLON.Vector3( split[0], split[1], split[2] );
    }

    static positionToIndex( position ) {

        return ObjectContainerUtils.gridToIndex( ObjectContainerUtils.positionToGrid( position ) );
    }

    static indexToApproximatePosition( index ) {

        return ObjectContainerUtils.gridToApproximatePosition( ObjectContainerUtils.indexToGrid( index ) );
    }

}