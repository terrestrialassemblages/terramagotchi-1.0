import { AirParticle } from "../particles";
import { PlantConstructor } from "./plant_constructor";
import { StemParticle } from "./stem";

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
            this.current_spread = this.dna.branch_spread.shift()
        }

        this.dna.__current_angle = ((this.dna.__current_angle % 360) + 360) % 360
        let normalised_current_angle = (((((this.dna.__current_angle + 22.5) % 360) / 45 >> 0) % 8) + 8) % 8
        let normalised_directions =  [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]

        for (let i = 0; i < this.desired_actions.length; i++) {
            let norm_i = (((normalised_current_angle + this.desired_actions[i]) % 8) + 8) % 8
            console.log(normalised_current_angle)
            console.log(this.desired_actions)
            console.log(norm_i)
            console.log(normalised_directions)
            this.desired_actions[i] = [...normalised_directions[norm_i], this.desired_actions[i]]
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
            let [action_x, action_y, theta] = this.desired_actions[0]

            if (environment.get(this.x + action_x, this.y + action_y) instanceof AirParticle) {
                
                this.perform_first_action(environment)

            }

        }

    }

    perform_first_action(environment) {
        let [action_x, action_y, theta] = this.desired_actions.shift()
        
        let new_dna = {...this.dna}
        new_dna.branch_spread = [...this.dna.branch_spread]
        new_dna.branching_factor = JSON.parse(JSON.stringify(this.dna.branching_factor))

        new_dna.__current_length = 1
        new_dna.__current_dx = Math.abs(action_x)
        new_dna.__current_dy = Math.abs(action_y)
        new_dna.__current_angle = new_dna.__current_angle + theta*this.current_spread
        new_dna.__current_angle = ((new_dna.__current_angle % 360) + 360) % 360
        new_dna.stem_length -= new_dna.stem_shortening_factor

        let new_stem_particle = new StemParticle(this.x + action_x, this.y + action_y, new_dna)
        environment.set(new_stem_particle)
    }

    bloom_flower(environment) {
        this.is_active = false
        let replacement_particle = new AirParticle(this.x, this.y)
        environment.set(replacement_particle)
    }
}