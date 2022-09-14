import { OrganicParticle } from "../particles/organic";

import {
    PlantParticle,
    LeafParticle,
    FlowerParticle,
    RootParticle,
    PlantNodeParticle,
    StemParticle,
} from "./";

export class PlantConstructor extends OrganicParticle {
    constructor(x, y, plant_dna=null) {
        super(x, y);

        this.color_variance = 0

        this.water_capacity = 50
        this.nutrient_capacity = 50
        this.activation_level = 0

        this.__living_plant_particle_types = [PlantParticle, LeafParticle, FlowerParticle, RootParticle, PlantNodeParticle, StemParticle]
        
        this.dna = plant_dna

        if (plant_dna == null) {
            let new_plant_dna = {

                __current_angle: 0,
                __current_dx: 0,
                __current_dy: 0,
                __current_length: 0,

                branching_factor:    [[0], [-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
                branch_spread:       [0, 10, 20, 30],

                stem_width:  1,
                stem_length: 20,
                stem_shortening_factor: 0,
                leaf_width:  3,
                leaf_height: 2,

                stem_color:      "#00FF00",
                flower_color:    "#FF0000",
                leaf_color:      "#000000",
            }
            this.dna = new_plant_dna
        }

    }
}