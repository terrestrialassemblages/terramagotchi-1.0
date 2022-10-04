import { PlantParticleFamily } from "./plant";
import { SoilParticle } from "../soil";


export class RootParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#6B3226"; // source: https://www.color-name.com/root-brown.color
        this.moveable = false;
        this.weight = 3;
        this.is_node = false; // if true, then this particle is a root node, a root node is a root particle that spawns multiple roots in other directions
        this.is_active = true; // checks whether the particle has grown anything or not, if it has grown, then it doesn't try to grow again, it just absorbs water
        this.direction = 1; // direction the root is growing. 0 = left, 1 = down, 2 = right, 3 = bottom left, 4 = bottom right, by default, it grows in the direction it was initially spawned in
    }

    update(environment) {
        this.absorb_water(environment, [RootParticle, SoilParticle]);
        this.absorb_nutrients(environment, [RootParticle, SoilParticle]);
        this.rootstuff(environment);
    }

    rootstuff(environment) {
        if (this.nutrient_level >= this.activation_level
            && this.water_level >= this.activation_level
            && this.is_active == true
            && this.dna.__current_length <= this.dna.root_length_max) // checks to make sure the roots are only as long as we want it to be
        {
            this.try_germinate(environment);
            let direction_hold = { ...this.direction };
            if ((this.dna.__current_length % this.dna.root_node_spawn_distance) == 0) { // this is there to space out root nodes, making them spawn only a certain units away from the previous one
                this.is_node = true;
            }
            if (this.is_node) { // if its a node, it randomly spawns a random amount of roots in a random directions
                for (let i = 0; i <= Math.floor(Math.random() * 5); i++) {
                    this.direction = Math.floor(Math.random() * 5);
                    this.try_germinate(environment);
                }
                this.is_active = false; // once a root grows, it stops growing and just absorbes water and nutrients
            }
            this.direction = direction_hold;
        }
    }

    try_germinate(environment) { 
        let new_root = null;
        let soil_particle_check = null;
        this.is_active = false; // check to make it stop growing further
        let [offset_x, offset_y] = [[-1, 0], [0, -1], [1, 0], [-1, -1], [1, -1]][this.direction]; // is the possible directions it can grow, and the one its set to grow in
        soil_particle_check = environment.get(this.x + offset_x, this.y + offset_y);
        if (soil_particle_check instanceof SoilParticle) { // checks if the intended direction has a soil particle then grows there
            new_root = new RootParticle(this.x + offset_x, this.y + offset_y, { ...this.dna });
        }

        if (new_root != null) { // if a root node has grown, new root particle takes over the soil's nutrient and water level, and parent root particle decrements its water and nutrients
            new_root.direction = this.direction;
            new_root.dna.__current_length++;
            new_root.nutrient_level = soil_particle_check.nutrient_level;
            new_root.water_level = soil_particle_check.water_level;
            this.nutrient_level = this.nutrient_level - this.activation_level;
            this.water_level = this.water_level - this.activation_level;
            environment.set(new_root);
        }
    }
}