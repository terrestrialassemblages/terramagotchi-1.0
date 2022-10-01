import { AirParticle } from "../particles";
import { PlantParticleFamily } from "./plant";
import { Environment } from "../environment";
import { DNANode } from "./plant_dna_node";

const RANDOM_WEIGHT_GROWWTH_DIRECTION = true

export class StemParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        /**
         * @param {Number}  x           (Integer) x-coordinate of particle to be constructed
         * @param {Number}  y           (Integer) y-coordinate of particle to be constructed
         * @param {DNANode} plant_dna   The DNA-node object for this plant particle. Represents a node in a tree graph.
         */
        super(x, y, plant_dna);

        this.activation_level = this.dna.node_activation_level
        this.base_color = this.dna.stem_color

        this.is_active = true
        this.growth_angle = this.dna.get_absolute_angle()
        
        this.__current_length = 1
        this.__current_angle = this.dna.get_absolute_angle()
        this.__dx = 0
        this.__dy = 0
        
        // __growth_direction of type Array(2) = [offset_x, offset_y]
        this.__growth_direction = [0, 1]
    }

    update(environment) {
        this.absorb_nutrients(environment, this.__living_plant_particle_types)
        this.absorb_water(environment, this.__living_plant_particle_types)

        if (!this.is_active) {
            this.bark_update(environment)
            return;
        }

        switch (this.dna.node_type) {
            case "stem":
                this.stem_update(environment)
                break
            case "flower":
                this.flower_update(environment)
                break
            case "leaf":
                this.flower_update(environment)
                break
            default:
                break
        }
    }

    stem_update(environment) {
        /**
         * Handles update function if the current particles dna node_type is "stem"
         * @param {Environment} environment     The current game environment
         */

        this.start_x = this.x - this.__dx
        this.start_y = this.y - this.__dy
        this.end_x = (this.start_x + this.dna.stem_length * Math.cos(this.__current_angle*Math.PI/180)) | 0
        this.end_y = (this.start_y + this.dna.stem_length * Math.sin(this.__current_angle*Math.PI/180)) | 0

        this.__growth_direction = this.calculate_growth_direction()

        if (this.__current_length == this.dna.stem_length) {
            this.grow_next_DNA_child(environment)
            return;
        }

        this.grow(environment)
        


    }

    flower_update(environment) {
        
    }

    bark_update(environment) {
        /**
         * Handles growing of bark
         * @param {Environment} environment     The current game environment
         */
        let current_stem_thickness = this.dna.stem_end_thickness +
                                        ((this.__current_length / this.dna.stem_length) * (this.dna.stem_thickness - this.dna.stem_end_thickness) | 0)
        
        if (current_stem_thickness <= 1)
            return;

        current_stem_thickness -= 1
        
        let left_bark_thickess = (current_stem_thickness / 2) | 0
        let right_bark_thickess = ((current_stem_thickness / 2) + 0.5) | 0
        if (this.dna.bark_start_direction == -1)
            [left_bark_thickess, right_bark_thickess] = [right_bark_thickess, left_bark_thickess]
        
        let left_bark_angle = this.growth_angle + 90
        let right_bark_angle = this.growth_angle - 90
        
    }

    grow(environment) {
        let [offset_x, offset_y] = this.__growth_direction
        if (RANDOM_WEIGHT_GROWWTH_DIRECTION) {
            let random_rotation = this.weighted_random([-2, -1, 0, 1, 2], [5, 20, 20, 20, 5])
            if (random_rotation != 0)
                [offset_x, offset_y] = this.get_rotated_offset(offset_x, offset_y, random_rotation)
        }
        if (!(environment.get(this.x+offset_x, this.y+offset_y) instanceof AirParticle))
            return;
        let new_particle = new StemParticle(this.x + offset_x, this.y + offset_y, this.dna)
        new_particle.__dx = this.__dx + offset_x
        new_particle.__dy = this.__dy + offset_y
        new_particle.__current_length = this.__current_length + 1
        environment.set(new_particle)
        this.is_active = false
    }

    grow_next_DNA_child(environment) {
        /**
         * Handles sprouting children branches based on the current plant DNA nodes children
         * @param {Environment} environment     The current game environment
         */

        // keeping track of children to grow
        this.__unvisited_children = this.__unvisited_children || [...this.dna.children]
        if (this.__unvisited_children.length == 0) {
            this.is_active = false
            return;
        }
        let next_child_dna = this.__unvisited_children.shift()
        let child_growth_direction = this.convert_angle_to_offset(this.__current_angle + next_child_dna.stem_angle)
        
        // Maybe add weights
        let [offset_x, offset_y] = child_growth_direction
        let target_particle = environment.get(this.x + offset_x, this.y + offset_y)
        if (target_particle instanceof AirParticle || target_particle instanceof PlantParticleFamily && !target_particle.is_active) {
            let new_stem_particle = new StemParticle(this.x + offset_x, this.y + offset_y, next_child_dna)
            new_stem_particle.__dx = offset_x
            new_stem_particle.__dy = offset_y
            environment.set(new_stem_particle)
        } else {
            this.__unvisited_children.push(next_child_dna)
        }
    }

    calculate_growth_direction(angle_offset=0) {
        /**
         * Returns which neighbour cell the stem will grow into
         * @param {Number}  angle_offset    (Optional) anlge offset from the current stem particle
         */
        let theta = this.__current_angle + angle_offset
        let [vector_x, vector_y] = this.create_vector_functions()

        if (this.__dx == 0 && this.__dy == 0)
            this.growth_angle = theta
        else
            this.growth_angle = Math.atan2(vector_y(this.__dy), vector_x(this.__dx))*180/Math.PI

        return this.convert_angle_to_offset(this.growth_angle)
    }

    create_vector_functions() {
        switch (this.dna.stem_curve) {
            case "spherical":
                let [centre_x, centre_y] = [this.start_x + this.dna.stem_length * Math.cos(this.__current_angle*Math.PI/180)/2,
                                    this.start_y + this.dna.stem_length * Math.sin(this.__current_angle*Math.PI/180)/2]
                let rotated_angle = this.__current_angle - 90
                centre_x += -this.dna.curve_direction * this.dna.curve_radius * Math.cos(rotated_angle*Math.PI/180)
                centre_y += -this.dna.curve_direction * this.dna.curve_radius * Math.sin(rotated_angle*Math.PI/180)

                let delta_x = this.x - centre_x
                let delta_y = this.y - centre_y
                
                return [((x) => -this.dna.curve_direction*delta_y), ((y) => this.dna.curve_direction*delta_x)]
            case "linear":
            default:
                return [((x) => this.end_x - (this.start_x + x)), ((y) => this.end_y - (this.start_y + y))]
        }
    }

    calculate_direction_error(direction) {
        let [offset_x, offset_y] = direction
        let new_theta = Math.atan2(this.dna.__current_dy + offset_y, this.dna.__current_dx + offset_x) * 180 / Math.PI
        new_theta = ((new_theta % 360) + 360) % 360
        return Math.abs(new_theta - this.__current_angle)
    }











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

        // Truncates rotation and modulos to be in range [0, 8)
        rotation = (((rotation | 0) % 8) + 8) % 8

        // Recursive base case
        if (rotation <= 0)
            return [offset_x, offset_y]
        
        // Recursive function to find rotated offset value. Worst case runtime=8 recursive calls
        switch ([offset_x, offset_y]) {
            case [1, 0]:
                return this.get_rotated_offset(1, 1, rotation-1)
            case [1, 1]:
                return this.get_rotated_offset(0, 1, rotation-1)
            case [0, 1]:
                return this.get_rotated_offset(-1, 1, rotation-1)
            case [-1, 1]:
                return this.get_rotated_offset(-1, 0, rotation-1)
            case [-1, 0]:
                return this.get_rotated_offset(-1, -1, rotation-1)
            case [-1, -1]:
                return this.get_rotated_offset(0, -1, rotation-1)
            case [0, -1]:
                return this.get_rotated_offset(1, -1, rotation-1)
            case [1, -1]:
                return this.get_rotated_offset(1, 0, rotation-1)
        }

        // Default case for unexpected offset_x/offset_y values will be upwards ([0, 1])
        return [0, 1]
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