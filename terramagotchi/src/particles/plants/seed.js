import {
    PlantFamilyParticle,
    RootParticle,
    StemParticle,
} from ".";

import {
    AirParticle,
    CompostParticle,
    GrassParticle,
    SoilParticle,
} from "..";

import {
    Environment,
    NUTRIENT_ENERGY_RATIO,
    WATER_ENERGY_RATIO
} from "../../environment";

export class SeedParticle extends PlantFamilyParticle {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);

        this.moveable = true;
        this.weight = 2;
        this.base_color = this.dna.seed_color || "#FF80FF"

        this.activation_level = (this.dna.seed_activation_level != null) ? this.dna.seed_activation_level : 0

        // Minimum energy capacity = the particles activation level, to never not have it as an option
        this.energy_capacity = Math.max(this.energy_capacity, this.activation_level)
        
        this.germinated = false
    }

    update(environment) {
        /**
         * Handles update function for the seed particle
         * @param {Environment} environment     The current game environment
         */
        this.compute_gravity(environment)
        this.health_update(environment)
        
        this.absorb_nutrients(environment, this.__neighbours, [SoilParticle, CompostParticle])
        this.absorb_water(environment, this.__neighbours, [SoilParticle, CompostParticle])
        this.generate_energy()

        if (!this.germinated)
            if (this.energy >= this.activation_level)
                this.germinated = true
        
        // Separated out so plant grows
        if (this.germinated)
            this.grow(environment)
    }

    grow(environment) {
        /**
         * Handles growing the seed into a stem and root particle if the conditions are correct
         * @param {Environment} environment     The current game environment
        */
        if (environment.get(this.x, this.y - 1) instanceof SoilParticle && !(environment.get(this.x, this.y - 1) instanceof GrassParticle)) {
            let new_stem_cell = new StemParticle(this.x, this.y, this.dna)
            
            if (PlantFamilyParticle.IS_NET_ZERO){
                new_stem_cell.nutrient_level += (this.activation_level + this.energy) * NUTRIENT_ENERGY_RATIO
                new_stem_cell.water_level += (this.activation_level + this.energy) * WATER_ENERGY_RATIO
            }

            environment.set(new_stem_cell)
            
            let new_root = new RootParticle(this.x, this.y - 1, this.dna)
            new_root.is_node = true; // makes the first particle a node, for special properties
            new_root.is_first_particle = true; // makes that particle know its the first particle, same reason why
            new_root.parent_root_particle = [this.x, this.y]; // set's it's parent particle as the stem particle spawned by the seed. Used for death code
            environment.set(new_root)
        }
    }
}