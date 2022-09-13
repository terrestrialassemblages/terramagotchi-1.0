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
            this.desired_actions.sort(function() { return 0.5 - Math.random();})
        }

        this.base_color = "#FF0000";
        this.moveable = false;
        this.weight = 3;
    }

    update(environment) {
        if (!this.is_active)
            return;
        
        if (this.is_flower)
            return this.bloom_flower(environment)
        
        this.absorb_nutrients(environment, this.__living_plant_particle_types)
        this.absorb_water(environment, this.__living_plant_particle_types)

        if (this.desired_actions.length == 0) {
            this.is_active = false
            return;
        }

        if (this.water_level >= this.activation_level && this.nutrient_level >= this.activation_level) {
            this.perform_action(environment, this.desired_actions.pop())
        }

    }

    perform_action(environment, direction) {
        // Normalise the dna current_angle to each of 8 directions from pixel
        // Start -1 to left and +1 to right, 0 at normalised target pixel
        // Yeet
    }

    bloom_flower(environment) {
        let replacement_particle = new AirParticle(this.x, this.y)
        environment.set(replacement_particle)
    }
}