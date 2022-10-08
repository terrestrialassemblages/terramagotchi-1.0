import { PlantParticleFamily } from "./plant";
import { AirParticle } from "..";

export class LeafParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
    }

    update(environment) {
        this.absorb_nutrients(environment, this.__neighbours, this.__living_plant_particle_types)
        this.absorb_water(environment, this.__neighbours, this.__living_plant_particle_types)
        this.generate_energy()
        this.health_update(environment)
        
        if (this.is_active && this.energy >= this.activation_level)
            this.grow_children(environment)
    }

    grow_children(environment) {
        if (this.__current_length >= this.dna.leaf_size) {
            this.is_active = false
            return;
        }
        let valid_neighbours
        switch (this.dna.leaf_shape) {
            case "lavender":
                
            case "sunflower":
                if (this.__current_length == 1)
                    valid_neighbours = [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [1, 0], [0, -1], [-1, 0]]
                else
                    valid_neighbours = [this.convert_angle_to_offset(this.__current_angle)]
                break
            case "flat-top":
            default:
                valid_neighbours = [[0, -1], [this.dna.leaf_direction, 0]]
        }

        for (let neighbour of valid_neighbours) {
            let [offset_x, offset_y] = neighbour
            let target_particle = environment.get(this.x+offset_x, this.y+offset_y)
            if (target_particle instanceof AirParticle || (this.dna.growth_destructive && target_particle instanceof PlantParticleFamily && !target_particle.is_active)) {
                let new_leaf = new LeafParticle(this.x+offset_x, this.y+offset_y, this.dna)
                new_leaf.__current_angle = this.convert_offset_to_base_angle(offset_x, offset_y)
                new_leaf.__current_length = this.__current_length + 1
                if (new_leaf.__current_length >= this.dna.secondary_color_length)
                    new_leaf.base_color = this.dna.secondary_color

                environment.set(new_leaf)
                
                this.energy -= this.activation_level
                break //necessary
            }
        }
    }
}