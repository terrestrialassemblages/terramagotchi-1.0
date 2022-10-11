import { PlantParticleFamily } from "./plant";
import { SoilParticle } from "../soil";
import { FastRandom } from "../../fast-random";


export class RootParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#6B3226"; // source: https://www.color-name.com/root-brown.color
        this.moveable = false;
        this.weight = 3;
        this.is_node = false; // if true, then this particle is a root node, a root node is a root particle that spawns multiple roots in other directions
        this.is_active = true; // checks whether the particle has grown anything or not, if it has grown, then it doesn't try to grow again, it just absorbs water
        this.direction = 1; // direction the root is growing. 0 = left, 1 = down, 2 = right, 3 = bottom left, 4 = bottom right, by default, it grows in the direction it was initially spawned in
        this.activation_level = 0

        this.root_node_spawn_distance = this.dna.root_node_spawn_distance || 5
        this.root_length_max = this.dna.root_length_max || 20
        this.root_max_curve_length = this.dna.root_max_curve_length || 3
        
        this.direction = 1
        this.current_curve_length = 0
    }
    
    update(environment) {
        this.absorb_water(environment, this.__neighbours, [RootParticle, SoilParticle]);
        this.absorb_nutrients(environment, this.__neighbours, [RootParticle, SoilParticle]);
        if (this.is_active == true) {
            this.check_growth_conditions(environment);
        }
    }

    check_growth_conditions(environment) {
        if (this.nutrient_level >= this.activation_level
            && this.water_level >= this.activation_level
            && this.__current_length <= this.root_length_max) // checks to make sure the roots are only as long as we want it to be
        {
            this.grow_child_root(environment);
            let direction_hold = this.direction;
            if ((this.__current_length % this.root_node_spawn_distance) == 0) { // this is there to space out root nodes, making them spawn only a certain units away from the previous one
                this.is_node = true;
                this.current_curve_length = 0;
            }
            if (this.is_node) { // if its a node, it randomly spawns a random amount of roots in a random directions
                for (let i = 0; i <= FastRandom.int_max(4); i++) {
                    this.direction = FastRandom.int_max(5);
                    if (this.direction > 4) {
                        this.direction = 1;
                    }
                    this.grow_child_root(environment);
                }
                this.is_active = false; // once a root grows, it stops growing and just absorbes water and nutrients
            }
            this.direction = direction_hold;
        }
    }

    grow_child_root(environment) {
        let new_root = null;
        let soil_particle_check = null;
        this.is_active = false; // check to make it stop growing further
        let [offset_x, offset_y] = [[-1, 0], [0, -1], [1, 0], [-1, -1], [1, -1]][this.direction]; // is the possible directions it can grow, and the one its set to grow in

        let curve_direction = FastRandom.int_max(2) // 0 = follow current path, 1 = curve clockwise, 2 = curve anti-clockwise
        if (this.current_curve_length < this.root_max_curve_length && this.current_curve_length > (this.root_max_curve_length * -1) && curve_direction != 0) {
            if (curve_direction == 1) {
                [offset_x, offset_y] = [[-1, 1], [-1, -1], [1, -1], [-1, 0], [0, -1]][this.direction]
                this.current_curve_length++; // it adds 1 if its clockwise and subtracts 1 if its anti
            }
            else {
                [offset_x, offset_y] = [[-1, -1], [1, -1], [1, 1], [0, -1], [1, 0]][this.direction]
                this.current_curve_length--;
            }
        }

        soil_particle_check = environment.get(this.x + offset_x, this.y + offset_y);
        if (soil_particle_check instanceof SoilParticle) { // checks if the intended direction has a soil particle then grows there
            new_root = new RootParticle(this.x + offset_x, this.y + offset_y, { ...this.plant_dna });
        }

        if (new_root != null) { // if a root node has grown, new root particle takes over the soil's nutrient and water level, and parent root particle decrements its water and nutrients
            new_root.direction = this.direction;
            new_root.__current_length = this.__current_length + 1;
            new_root.current_curve_length = this.current_curve_length;
            new_root.root_length_max = this.root_length_max;
            new_root.root_node_spawn_distance = this.root_node_spawn_distance;
            new_root.root_max_curve_length = this.root_max_curve_length;


            environment.set(new_root);
            this.water_level -= this.activation_level
            this.nutrient_level -= this.activation_level
        }
    }





















    

    absorb_water(environment, potential_neighbours, valid_neighbour_types) {
        // Choose random neighbour
        let [offset_x, offset_y] = FastRandom.choice(potential_neighbours)
        let random_neighbour = environment.get(
            this.x + offset_x,
            this.y + offset_y
        );

        // Check if random neighbour is a valid type (feel free to rewrite implementation)
        let neighbour_valid_type = false;
        for (const valid_type of valid_neighbour_types) {
            if (random_neighbour instanceof valid_type) {
                neighbour_valid_type = true;
                break;
            }
        }

        // Method 1
        // let transfer_amount = 5;
        // Method 2
        let transfer_amount = FastRandom.int_max(10);
        // Method 3
        //let transfer_amount = Math.floor((random_neighbour.water_level - this.water_level) / (1.5 + FastRandom.random()));

        // Attempt to absorb water from random neighbour
        if (
            neighbour_valid_type &&
            this.water_level + transfer_amount <= this.water_capacity &&
            random_neighbour.water_level >= transfer_amount &&
            this.water_level + transfer_amount < random_neighbour.water_level &&
            !random_neighbour.__water_transferred &&
            !this.__water_transferred
        ) {
            // Transfer water
            this.water_level += Math.max(transfer_amount, 1);
            random_neighbour.water_level -= Math.max(transfer_amount, 1);

            // Ensure water is not transfered again this tick
            this.__water_transferred = true;
            random_neighbour.__water_transferred = true;
        }
    }

    absorb_nutrients(environment, potential_neighbours, valid_neighbour_types) {
        // Choose random neighbour
        let [offset_x, offset_y] = FastRandom.choice(potential_neighbours);
        let random_neighbour = environment.get(
            this.x + offset_x,
            this.y + offset_y
        );

        // Check if random neighbour is a valid type (feel free to rewrite implementation)
        let neighbour_valid_type = false;
        for (const valid_type of valid_neighbour_types) {
            if (random_neighbour instanceof valid_type) {
                neighbour_valid_type = true;
                break;
            }
        }

        // Method 1
        // let transfer_amount = 5;
        // Method 2
        //let transfer_amount = FastRandom.int_max(1);
        // Method 3
        let transfer_amount = Math.floor(
            (random_neighbour.nutrient_level - this.nutrient_level) /
                (1.5 + FastRandom.random())
        );

        // Attempt to absorb nutrient from random neighbour
        if (
            neighbour_valid_type &&
            this.nutrient_level + transfer_amount <= this.nutrient_capacity &&
            random_neighbour.nutrient_level >= transfer_amount &&
            this.nutrient_level + transfer_amount <
                random_neighbour.nutrient_level &&
            !random_neighbour.__nutrient_transferred &&
            !this.__nutrient_transferred
        ) {
            // Transfer nutrient
            this.nutrient_level += Math.max(transfer_amount, 1);
            random_neighbour.nutrient_level -= Math.max(transfer_amount, 1);

            // Ensure nutrient is not transfered again this tick
            this.__nutrient_transferred = true;
            random_neighbour.__nutrient_transferred = true;
        }
    }
}