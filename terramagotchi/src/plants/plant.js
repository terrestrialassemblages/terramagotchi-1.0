import { OrganicParticle } from "../particles/organic";

import {
    LeafParticle,
    FlowerParticle,
    RootParticle,
    PlantNodeParticle,
    StemParticle,
} from ".";

export class Plant extends OrganicParticle {
    constructor(x, y, plant_dna=null) {
        super(x, y);

        this.color_variance = 0

        this.water_capacity = 50
        this.nutrient_capacity = 50
        this.activation_level = 0

        this.__living_plant_particle_types = [LeafParticle, FlowerParticle, RootParticle, PlantNodeParticle, StemParticle]
        
        this.dna = plant_dna

        if (plant_dna == null) {
            let new_plant_dna = {

                __current_angle: 90,
                __current_dx: 0,
                __current_dy: 0,
                __current_length: 0,

                branching_factor:    [[1], [-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
                branch_spread:       [15, 65, 45, 45],

                stem_width:  1,
                stem_length: 23,
                stem_shortening_factor: 2,
                leaf_width:  3,
                leaf_height: 2,
                root_length_max: 30,
                root_node_spawn_distance: 10,

                stem_color:      "#00FF00",
                flower_color:    "#FF0000",
                leaf_color:      "#000000",
            }
            this.dna = new_plant_dna
        }

    }
}