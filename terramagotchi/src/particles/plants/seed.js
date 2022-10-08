import { SoilParticle, CompostParticle, AirParticle } from "..";
import { PlantParticleFamily } from "./plant";
import { RootParticle } from "./root";
import { StemParticle } from "./stem";
import { Environment } from "../../environment";

export class SeedParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.moveable = true;
        this.weight = 2;

        this.activation_level = this.dna.seed_activation_level
        this.base_color = this.dna.seed_color || "#FF80FF"

        this.germinated = false
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
        if (environment.get(this.x, this.y-1) instanceof SoilParticle) {
            let new_stem_cell = new StemParticle(this.x, this.y, this.dna)
            environment.set(new_stem_cell)

            let new_root = new RootParticle(this.x, this.y-1, this.dna)
            // environment.set(new_root)
        }
    }
}