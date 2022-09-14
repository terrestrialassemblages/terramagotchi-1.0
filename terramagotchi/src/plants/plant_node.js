import { AirParticle } from "../particles";
import { PlantConstructor } from "./plant_constructor";

export class PlantNodeParticle extends PlantConstructor {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);

        this.is_active = true
        this.is_flower = false
        this.desired_actions = []

        if (this.dna.branching_factor.length == 0) {
            this.is_flower = true
        } else {
            this.desired_actions = this.dna.branching_factor.shift()
        }

        let normalised_current_angle = ((((this.dna.__current_angle + 22.5) / 45 >> 0) % 8) + 8) % 8
        let normalised_directions =  [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]
        for (let i = 0; i < this.desired_actions.length; i++) {
            let norm_i = (((normalised_current_angle + this.desired_actions[i]) % 8) + 8) % 8
            this.desired_actions = normalised_directions[norm_i]
        }

        this.base_color = "#FF0000";
        this.moveable = false;
        this.weight = 3;
    }

    update(environment) {

        this.absorb_nutrients(environment, this.__living_plant_particle_types)
        this.absorb_water(environment, this.__living_plant_particle_types)
        
        if (this.is_flower)
            return this.bloom_flower(environment)

        if (!this.is_active || this.desired_actions.length == 0) {
            this.is_active = false
            return;
        }

        if (this.water_level >= this.activation_level && this.nutrient_level >= this.activation_level) {
            this.desired_actions.sort(function() { return 0.5 - Math.random();})
            let [action_x, action_y] = this.desired_actions[0]

            if (environment.get(this.x + action_x, this.y + action_y) instanceof AirParticle) {
                
                this.perform_first_action(environment)

            }

        }

    }

    perform_first_action(environment, direction) {
        // Normalise the dna current_angle to each of 8 directions from pixel
        // Start -1 to left and +1 to right, 0 at normalised target pixel
        // Yeet
    }

    bloom_flower(environment) {
        this.is_active = false
        let replacement_particle = new AirParticle(this.x, this.y)
        environment.set(replacement_particle)
    }
}