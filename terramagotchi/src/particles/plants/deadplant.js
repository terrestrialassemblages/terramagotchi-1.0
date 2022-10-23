import { ShootSystemParticle } from ".";
import { OrganicParticle } from "../organic";
import { StemParticle, BarkParticle, LeafParticle } from ".";
import { FastRandom } from "../../fast-random";
import { AirParticle } from "../air";
import { Environment } from "../../environment";

const DESPAWN_IF_EMPTY_CHANCE = 0.01

export class DeadPlantParticle extends OrganicParticle {
    /**
     * @param {Number}  x           (Integer) x-coordinate of particle to be constructed
     * @param {Number}  y           (Integer) y-coordinate of particle to be constructed
     * @param {DNANode} plant_dna   The DNA-node object for this plant particle. Represents a node in a tree graph.
     */
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        
        this.base_color = "#8D5D4F";
        this.pass_through_types = [ StemParticle, BarkParticle, LeafParticle ];

        this.can_erode = true;
    }

    /**
     * Handles update function for the deadplant particle
     * @param {Environment} environment     The current game environment
     */
    update(environment) {
        // Toggle erosion to false after entering the pass-through layer
        if (this.can_erode && this.passing_through) this.can_erode = false;
        // Toggle erosion to true after hovering above an empty particle
        if (!this.can_erode && environment.get(this.x, this.y - 1).empty) this.can_erode = true;

        if (this.can_erode) this.compute_erosion(environment)
        this.compute_gravity(environment)

        this.compute_compact(environment)

        if (
            this.water_level == 0 &&
            this.nutrient_level == 0 &&
            FastRandom.random() < DESPAWN_IF_EMPTY_CHANCE
        ) {
            environment.set(new AirParticle(this.x, this.y))
        }
    }

    /**
     * Disperses water and nutrient levels from this particle to-
     * a lower DeadPlantParticle particle
     * 
     * @param {Environment} environment 
     */
    compute_compact(environment) {
        let particle_below = environment.get(this.x, this.y - 1);

        // Particle below is also a DeadPlantParticle
        if (particle_below instanceof DeadPlantParticle) {
            
            // Attempt nutrient dispersion
            if (particle_below.nutrient_level < particle_below.nutrient_capacity) {
                // Transfer as much nutrient as possible to particle_below
                let transfer_amount = Math.min(
                    this.nutrient_level,
                    particle_below.nutrient_capacity -
                        particle_below.nutrient_level
                );
                particle_below.nutrient_level += transfer_amount;
                this.nutrient_level -= transfer_amount;
            }

            // Attempt water dispersion
            if (particle_below.water_level < particle_below.water_capacity) {
                // Transfer as much water as possible to particle_below
                let transfer_amount = Math.min(
                    this.water_level,
                    particle_below.water_capacity -
                        particle_below.water_level
                );
                particle_below.water_level += transfer_amount;
                this.water_level -= transfer_amount;
            }
        }
    }

    get_color(s) {
        // Initialise colour if needed
        if (this.color === "#FF00FF") {
            super.get_color(s);
        }

        this.color = s.color(
            s.hue(this.color),
            s.saturation(this.base_color) * this.saturation_offset,
            s.brightness(this.base_color) * this.brightness_offset
        );
        return this.color;
    }
}