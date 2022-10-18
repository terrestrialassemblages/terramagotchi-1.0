import { ShootSystemParticle } from "./shoot_system";

import { AirParticle } from "..";

import { Environment } from "../../environment";

export class BarkParticle extends ShootSystemParticle {
    constructor(x, y, plant_dna=null) {
        /**
         * @param {Number}  x           (Integer) x-coordinate of particle to be constructed
         * @param {Number}  y           (Integer) y-coordinate of particle to be constructed
         * @param {DNANode} plant_dna   The DNA-node object for this plant particle. Represents a node in a tree graph.
         */
        super(x, y, plant_dna);
        this.activation_level = 0
    }

    update(environment) {        
        this.health_update(environment)
        this.absorb_nutrients(environment, this.__neighbours, this.__living_plant_particle_types)
        this.absorb_water(environment, this.__neighbours, this.__living_plant_particle_types)
        this.generate_energy()

        if (this.__current_length < this.__thickness && this.energy >= this.activation_level)
            this.grow(environment)
    }

    grow(environment) {
        let [offset_x, offset_y] = this.convert_angle_to_offset(this.growth_angle)
        let target_particle = environment.get(this.x+offset_x, this.y+offset_y)
        if (target_particle instanceof AirParticle) {
            let new_bark_particle = new BarkParticle(this.x+offset_x, this.y+offset_y, this.dna)
            new_bark_particle.__current_length = this.__current_length + 1
            new_bark_particle.__thickness = this.__thickness
            new_bark_particle.growth_angle = this.growth_angle
            environment.set(new_bark_particle)
            this.energy -= this.activation_level
        }
    }
}