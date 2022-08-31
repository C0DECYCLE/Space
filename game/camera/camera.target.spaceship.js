"use strict";

/*
    Palto Studio
    Developed by Noah Bussinger
    2022
*/

class CameraTargetSpaceship extends CameraTarget {

    /* override */ focusBeta = Math.PI / 2.2;

    /* override */ offsetRadius = 18;

    /* override */ update( spaceship ) {

        this.#adaptOffsetRadius( spaceship );

        super.update( spaceship );
    }

    #adaptOffsetRadius( spaceship ) {

        this.offsetRadius = EngineUtils.getBounding( spaceship.root ).size;
    }

}