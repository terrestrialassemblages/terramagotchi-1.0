import { PlantNodeParticle } from ".";
import { AirParticle } from "../particles";
import { Plant } from "./plant";

export class StemParticle extends Plant {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#FFFFFF";
        this.moveable = false;
        this.weight = 3;

        this.is_active = true
        this.growth_direction = this.calculate_growth_direction()
    }

    update(environment) {
        this.absorb_nutrients(environment, this.__living_plant_particle_types)
        this.absorb_water(environment, this.__living_plant_particle_types)

        if (!this.is_active) {
            return;
        }

        if (this.check_growth_conditions(environment)) {
            this.grow(environment)
            this.is_active = false
        }
    }

    check_growth_conditions(environment) {
        if (this.water_level >= this.activation_level && this.nutrient_level >= this.activation_level) {
            let [offset_x, offset_y] = this.growth_direction
            return (environment.get(this.x+offset_x, this.y+offset_y) instanceof AirParticle)
        }
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
}