import { SoilParticle, CompostParticle, AirParticle } from "..";
import { PlantParticleFamily } from "./plant";
import { RootParticle } from "./root";
import { StemParticle } from "./stem";
import { Environment } from "../../environment";
import { GrassParticle } from "../soil";

export class SeedParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.moveable = true;
        this.weight = 2;

        this.activation_level = this.dna.seed_activation_level
        this.base_color = this.dna.seed_color || "#FF80FF"

        this.germinated = false

        this.energy_capacity = Math.max(this.energy_capacity, this.activation_level)
    }

    update(environment) {
        /**
         * Handles update function for the seed particle
         * @param {Environment} environment     The current game environment
         */
        this.compute_gravity(environment)

        // Compute health before absorption in case plant dies
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
            environment.set(new_stem_cell)

            let new_root = new RootParticle(this.x, this.y - 1, this.dna)
            new_root.is_node = true; // makes the first particle a node, for special properties
            new_root.is_first_particle = true; // makes that particle know its the first particle, same reason why
            new_root.parent_root_particle = [this.x, this.y]; // set's it's parent particle as the stem particle spawned by the seed. Used for death code
            environment.set(new_root)
        }
    }
}