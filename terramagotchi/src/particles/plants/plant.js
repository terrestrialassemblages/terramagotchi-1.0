import { OrganicParticle } from "../organic";
import generate_tree_dna from "./plant_generator"

import {
    LeafParticle,
    FlowerParticle,
    RootParticle,
    StemParticle,
    BarkParticle,
} from ".";

import { DNANode } from "./plant_dna_node";

export class PlantParticleFamily extends OrganicParticle {
    constructor(x, y, plant_dna=null) {
        super(x, y);
        // Default moveable/weight values for most plant-type particles
        this.moveable = false
        this.weight = 3

        this.color_variance = 0.05

        this.water_capacity = 50
        this.nutrient_capacity = 50
        
        this.activation_level = 0

        // List of plant-type particles to decide which particle type
        this.__living_plant_particle_types = [LeafParticle, FlowerParticle, RootParticle, StemParticle, BarkParticle]

        // List of neighbours for absorb functions
        this.__neighbours = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]]
        
        this.dna = plant_dna
        if (this.dna == null) {
            let default_tree_dna = generate_tree_dna("PALM")
            this.dna = new DNANode(null, default_tree_dna)
        }
    }


    // Below are some common functions for plant-type particles
    weighted_random(items, weights) {
        /**
         * Returns a random element from an array with a weighted probability of choice.
         * @param {Array<Object>} items     Array of items to choose from
         * @param {Array<Number>} weights   (Array) Sequence of weights
         */
        var i;

        for (i = 0; i < weights.length; i++)
            weights[i] += weights[i - 1] || 0;
        
        var random = Math.random() * weights[weights.length - 1];
        
        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;
        
        return items[i];
    }

    get_rotated_offset(offset_x, offset_y, rotation=0) {
        /**
         * Takes values for an offset (which specifies a relative direction on a 2D grid),
         * returns the offset values for the nth neighbour (n=rotation)
         * @param {Number} offset_x     Integer in range [-1, 1]
         * @param {Number} offset_y     Integer in range [-1, 1]
         * @param {Number} rotation     Integer specifying which of n neighbouring directions to return.
         *                              Rotation direction is counter-clockwise
         */

        let theta = this.convert_offset_to_base_angle(offset_x, offset_y)
        theta += 45*rotation
        return this.convert_angle_to_offset(theta)

        // Deprecated code below cos I realised there was an obvious O(1) implementation


        // // Truncates rotation and modulos to be in range [0, 8)
        // rotation = (((rotation | 0) % 8) + 8) % 8

        // // Recursive base case
        // if (rotation <= 0)
        //     return [offset_x, offset_y]
        
        // // Recursive function to find rotated offset value. Worst case runtime=8 recursive calls
        // // switch ([offset_x, offset_y]) {
        // //     case [1, 0]:
        // //         return this.get_rotated_offset(1, 1, rotation-1)
        // //     case [1, 1]:
        // //         return this.get_rotated_offset(0, 1, rotation-1)
        // //     case [0, 1]:
        // //         return this.get_rotated_offset(-1, 1, rotation-1)
        // //     case [-1, 1]:
        // //         return this.get_rotated_offset(-1, 0, rotation-1)
        // //     case [-1, 0]:
        // //         return this.get_rotated_offset(-1, -1, rotation-1)
        // //     case [-1, -1]:
        // //         return this.get_rotated_offset(0, -1, rotation-1)
        // //     case [0, -1]:
        // //         return this.get_rotated_offset(1, -1, rotation-1)
        // //     case [1, -1]:
        // //         return this.get_rotated_offset(1, 0, rotation-1)
        // // }


        // // Default case for unexpected offset_x/offset_y values will be upwards ([0, 1])
        // return [0, 1]
    }

    convert_offset_to_base_angle(offset_x, offset_y) {
        /**
         * Converts a given x, y directional offset ([-1 ... 1, -1 ... 1]) to the middle angle
         * required to produce that offset
         * @param {Number} offset_x     Integer in range [-1, 1]
         * @param {Number} offset_y     Integer in range [-1, 1]
         */

         let angle_delta = 45 // Essentially, the degrees difference between each offset
        switch ([offset_x, offset_y]) {
            case [1, 0]:
                return 0
            case [1, 1]:
                return angle_delta*1
            case [0, 1]:
                return angle_delta*2
            case [-1, 1]:
                return angle_delta*3
            case [-1, 0]:
                return angle_delta*4
            case [-1, -1]:
                return angle_delta*5
            case [0, -1]:
                return angle_delta*6
            case [1, -1]:
                return angle_delta*7
        }

        // Default case for unexpected offset_x/offset_y values will be upwards ([0, 1])
        return [0, 1]
    }

    convert_angle_to_offset(angle, radians=false) {
        /**
         * Converts a given angle (in degrees) to an x/y offset that closest matches the given angle
         * IMPORTANT: ANGLES MEASURED COUNTER-CLOCKWISE FROM X-AXIS LINE, ALWAYS
         * @param {Number}  angle   An angle (in degrees) to be converted
         * @param {Boolean} radians (default=false) Whether the given angle is in radians or not
         */

        // Convert angle to degrees if given in radians
        if (radians)
            angle *= (180/Math.PI)
        
        // Rounding angle down (truncating decimals)
        angle |= 0

        // Modulus math to put angle in range (0 <= angle < 360)
        // Verbose because range of JS modulo includes negative numbers. cringe tbh
        angle = ((angle % 360) + 360) % 360

        let angle_delta = 45 // Essentially, the degrees difference between each offset

        if (angle < 22.5)
            return [1, 0]
        else if (angle < 22.5 + angle_delta*1)
            return [1, 1]
        else if (angle < 22.5 + angle_delta*2)
            return [0, 1]
        else if (angle < 22.5 + angle_delta*3)
            return [-1, 1]
        else if (angle < 22.5 + angle_delta*4)
            return [-1, 0]
        else if (angle < 22.5 + angle_delta*5)
            return [-1, -1]
        else if (angle < 22.5 + angle_delta*6)
            return [0, -1]
        else if (angle < 22.5 + angle_delta*7)
            return [1, -1]
        // swag logic, no else needed
        return [1, 0]
    }
}