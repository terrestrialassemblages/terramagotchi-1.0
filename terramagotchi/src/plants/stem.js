import { PlantNodeParticle } from ".";
import { AirParticle } from "../particles";
import { PlantParticleFamily } from "./plant";

export class StemParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.activation_level = this.dna.node_activation_level

        this.base_color = this.dna.stem_color

        this.is_active = true

        this.__current_length = 0
        this.__dx = 0
        this.__dy = 0
        this.__current_angle = 0
        this.__current

        // __growth_direction of type Array(2) = [offset_x, offset_y]
        this.__growth_direction = this.generate_growth_direction()
    }

    update(environment) {
        this.absorb_nutrients(environment, this.__living_plant_particle_types)
        this.absorb_water(environment, this.__living_plant_particle_types)

        if (!this.is_active)
            return;

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
        let growth_direction = calculate_growth_direction
        let curve = this.create_curve()
    }

    flower_update(environment) {
        
    }

    create_curve() {

    }

    grow(environment) {
        let [offset_x, offset_y] = this.growth_direction
        let new_plant_dna = {...this.dna}
        let new_particle
        if (this.dna.__current_length < this.dna.stem_length) {
            new_plant_dna.__current_length += 1
            new_plant_dna.__current_dx += offset_x
            new_plant_dna.__current_dy += offset_y
            new_particle = new StemParticle(this.x + offset_x, this.y + offset_y, new_plant_dna)
        } else {
            new_particle = new PlantNodeParticle(this.x + offset_x, this.y + offset_y, new_plant_dna)
        }
        environment.set(new_particle)
    }

    calculate_growth_direction() {
        let theta = this.dna.__current_angle
        theta = ((theta % 360) + 360) % 360
        let valid_directions = []
        if (270 <= theta && theta < 360) {
            valid_directions = [[1, 0], [0, -1]]
        } else if (0 <= theta && theta < 90) {
            valid_directions = [[1, 0], [0, 1]]
        } else if (90 <= theta && theta < 180) {
            valid_directions = [[-1, 0], [0, 1]]
        } else {
            valid_directions = [[-1, 0], [0, -1]]
        }
        let [direction_1, direction_2] = valid_directions
        let direction_1_error = this.calculate_direction_error(direction_1)
        let direction_2_error = this.calculate_direction_error(direction_2)
        return (direction_1_error < direction_2_error) ? direction_1 : direction_2
    }

    calculate_direction_error(direction) {
        let [offset_x, offset_y] = direction
        let new_theta = Math.atan2(this.dna.__current_dy + offset_y, this.dna.__current_dx + offset_x) * 180 / Math.PI
        new_theta = ((new_theta % 360) + 360) % 360
        return Math.abs(new_theta - this.dna.__current_angle)
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