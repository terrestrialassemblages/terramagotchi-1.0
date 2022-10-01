import { OrganicParticle } from "../particles/organic";

import {
    LeafParticle,
    FlowerParticle,
    RootParticle,
    PlantNodeParticle,
    StemParticle,
} from ".";

import { DNANode } from "./plant_dna_node";

export class PlantParticleFamily extends OrganicParticle {
    constructor(x, y, plant_dna=null) {
        super(x, y);
        // Default moveable/weight values for most plant-type particles
        this.moveable = false
        this.weight = 3

        this.color_variance = 0.05

        this.water_capacity = 50
        this.nutrient_capacity = 50
        this.activation_level = 0

        // List of plant-type particles to decide which particle type
        this.__living_plant_particle_types = [LeafParticle, FlowerParticle, RootParticle, PlantNodeParticle, StemParticle]
        
        this.dna = plant_dna
        if (this.dna == null) {
            let example_tree_encoding = ["stem", 0, 90, 40, "spherical", "#FF0000", 1, [["stem", 0, 60, 10, "linear", "#FFFFFF", 1, []], ["stem", 0, -45, 20, "linear", "#FF00FF", 1, []]]]
            this.dna = new DNANode(null, example_tree_encoding)
        }

    }
}