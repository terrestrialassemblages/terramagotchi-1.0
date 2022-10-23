import { PlantFamilyParticle } from "./plant";
import { SoilParticle } from "../soil";
import { FastRandom } from "../../fast-random";


export class RootParticle extends PlantFamilyParticle {
    /**
     * Roots work by a particle spawning another as a random walk. After a ceratin amount of root particles, a special 'node' particle is spawned.
     * Roots follow soil's absorbtion function, it absorbes from soil and root particles. So on average, Roots will have an even distribution of water and nutrients
     * A root node particle is that spawns other root particles, in a random amount, at random directions, but still counting towards the overall max walk length.
     * Root directions are all aimed generally downwards. Curves are designed to curve clockwise or anti clockwise, with a limit set to them too.
     * If one root dies, another root particle senses it, sets its state to dead, and then randomly changes to a soil particle.
     */
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#6B3226"; // source: https://www.color-name.com/root-brown.color
        this.moveable = false;
        this.weight = 3;
        this.is_node = false; // if true, then this particle is a root node, a root node is a root particle that spawns multiple roots in other directions
        this.is_active = true; // checks whether the particle has grown anything or not, if it has grown, then it doesn't try to grow again, it just absorbs water
        this.direction = 1; // direction the root is growing. 0 = left, 1 = down, 2 = right, 3 = bottom left, 4 = bottom right, by default, it grows in the direction it was initially spawned in
        this.activation_level = 0

        this.root_node_spawn_distance = this.dna.root_node_spawn_distance || 5 // controls how many root nodes are spawned. After this number of root particles, it spawns a node particle, always.
        this.root_length_max = this.dna.root_length_max || 20 // controls how long each walk can be. The algorithm attempts to meet this limit, but cannot always do so if there are objects blocking it. Measured in particles
        this.root_max_curve_length = this.dna.root_max_curve_length || 3 // controls how curvy a root can randomly curve. Measured in particles
        
        this.root_max_straight_length = 5 // controls how many particles can be in a straight line At Most. For aesthetic purposes. Measured in particles
        this.root_straight_length = 0 // counts how many particles has been straight in a row so far. Measured in particles
        this.can_be_straight = false // checks if it can go straight or not
        
        this.current_curve_length = 0 // counts how much the current curve is. Measured in particles

        this.parent_root_particle = [0,0]; // holds what its parent particle's coordinates it. Its coordinates as it can dynamically check if its still a plant/root or it was turned into soil
        this.is_first_particle = false; // checks if its the first root particle for a plant, as there are special properties for it
        this.has_checked_surroundings = false; // checks if a surrounding check has been done before. needs to be done at least once, details on it below
        this.minimum_distance = this.dna.root_minimum_distance || 5; // the minimum distance a root needs to go before its randomness kicks in.
        this.max_root_neighbours = 7; // how many neighbours of a root particle can be root particles. Made to prevent loops.
        this.update_speed = FastRandom.int_min_max(12, 20);
    }
    
    update(environment) {
        this.absorb_from_neighbours(environment, this.__neighbours, [SoilParticle, RootParticle]);
        let particle_to_check = environment.get(this.parent_root_particle[0], this.parent_root_particle[1])

        if (particle_to_check.dead == true || particle_to_check instanceof SoilParticle) { // if the parent particle is dead, which is also checked by seeing if its soil, it runs to kill the rest of the root particles.
            this.root_random_genocide(environment);
        }
        if (this.is_active == false &&
            this.has_checked_surroundings == false &&
            this.__current_length > this.minimum_distance)  // checks if a root is as isolated as you want to. only runs when its 'settled down'
        { this.root_isolated(environment); }

        if (this.is_active == true && environment.tick % this.update_speed == 0) {
            this.check_growth_conditions(environment);
        }
    }

    check_growth_conditions(environment) {
        if (this.nutrient_level >= this.activation_level
            && this.water_level >= this.activation_level
            && this.__current_length <= this.root_length_max) // checks to make sure the roots are only as long as we want it to be
        {
            if (this.root_straight_length < this.root_max_straight_length) { // if a root has been growing straight for longer than you want it to, it makes it curve
                this.can_be_straight = true;
            }
            this.grow_child_root(environment);
            let direction_hold = this.direction;
            if ((this.__current_length % this.root_node_spawn_distance) == 0) { // this is there to space out root nodes, making them spawn only a certain units away from the previous one
                this.is_node = true;
                this.current_curve_length = 0;
            }
            if (this.is_node) { // if its a node, it randomly spawns a random amount of roots in a random directions
                if (this.is_first_particle == false) { // if its the first particle, then it spawns roots in all 5 directions, for a certain distance. then the randomness kicks in
                    for (let i = 0; i <= FastRandom.int_max(4); i++) {
                        this.direction = FastRandom.int_max(5);
                        if (this.direction > 4) {
                            this.direction = 1;
                        }
                        this.grow_child_root(environment);
                    }
                } else {
                    for (let i = 0; i <= 4; i++) {
                        this.direction = i;
                        this.grow_child_root(environment);
                    }
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
        let all_directions = [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]]; // all 8 neighbours of a particle, held as an offset to said particle. is used in 2 places.
        let curve_direction = FastRandom.int_max(2) // 0 = follow current path, 1 = curve clockwise, 2 = curve anti-clockwise
        if (this.can_be_straight == false && curve_direction == 0) { // if it cannot be straight, then it forces a random curve, once it curves, it can be straight again
            curve_direction = FastRandom.int_max(1);
            curve_direction++;
        }
        // the curve algorithm only curves if a few criteria are met. such as Below its max curve length and it meeting the minium distance from the first root particle
        if (this.current_curve_length < this.root_max_curve_length &&
            this.current_curve_length > (this.root_max_curve_length * -1) &&
            curve_direction != 0 &&
            this.__current_length > this.minimum_distance) {

            if (curve_direction == 1) { 
                [offset_x, offset_y] = [[-1, 1], [-1, -1], [1, -1], [-1, 0], [0, -1]][this.direction]
                this.current_curve_length++; // it adds 1 if its clockwise and subtracts 1 if its anti
                if (this.root_straight_length > 0) {
                    this.root_straight_length--;
                }
            }
            else {
                [offset_x, offset_y] = [[-1, -1], [1, -1], [1, 1], [0, -1], [1, 0]][this.direction]
                this.current_curve_length--;
                if (this.root_straight_length > 0) {
                    this.root_straight_length--;
                }
            }
        }
        else if (curve_direction == 0) {
            this.root_straight_length++;
        }

        /** When growing, it checks if the new potential location is a neighbour of a root particle, if it is, then it doesn't grow. This is to prevent it from touching a root and forming a pocket or stealing nutrients
         * it still forms pockets and touches other roots due to multiple roots growing at the same tick, but at least its reduced
         */
        if (this.is_first_particle == false && this.__current_length > this.minimum_distance) {
            let new_x = this.x + offset_x
            let new_y = this.y + offset_y
            let check = true
            let opposite_direction = [offset_x * -1, offset_y * -1]
            
            for (let i = 0; i < 8; i++) {
                let check_coord = all_directions[i]
                if (check_coord[0] != opposite_direction[0] && check_coord[1] != opposite_direction[1]) {
                    soil_particle_check = environment.get(new_x + check_coord[0], new_y + check_coord[1]);
                    if (!(soil_particle_check instanceof SoilParticle)) {
                        check = false;
                    }
                }
                if (check == false) {
                    break
                }
            }
            if (check == true) {
                if (environment.get(this.x + offset_x, this.y + offset_y) instanceof SoilParticle) {
                    new_root = new RootParticle(this.x + offset_x, this.y + offset_y, this.plant_dna);
                }
            }
        } else { // if its the first particle then it just grows normally in all 5 directions for a minimum distance. No checks except a soil check is done, so it only grows into soil
            if (environment.get(this.x + offset_x, this.y + offset_y) instanceof SoilParticle) {
                new_root = new RootParticle(this.x + offset_x, this.y + offset_y, this.plant_dna);
            }
        }

        if (new_root != null) { // if a root node has grown, new root particle takes over the soil's nutrient and water level, and parent root particle decrements its water and nutrients
            new_root.direction = this.direction;
            new_root.__current_length = this.__current_length + 1;
            new_root.current_curve_length = this.current_curve_length;
            new_root.root_length_max = this.root_length_max;
            new_root.root_node_spawn_distance = this.root_node_spawn_distance;
            new_root.root_max_curve_length = this.root_max_curve_length;
            new_root.root_straight_length = this.root_straight_length;
            new_root.minimum_distance = this.minimum_distance;
            new_root.parent_root_particle = [this.x, this.y]

            environment.set(new_root);
            this.water_level -= this.activation_level
            this.nutrient_level -= this.activation_level
        }
    }

    root_random_genocide(environment) { // when a root's parent dies, it sets itself to dead and then randomly changes into soil. The next root particle sees this and does the same.
        this.dead = true;
        let die_chance = FastRandom.int_max(300) // this chance controls how fast the entire system will fade out.
        if (die_chance == 1) {
            let soil_replacement_particle = new SoilParticle(this.x, this.y);
            environment.set(soil_replacement_particle);
        }
    }

    // checks to see if a root is as isolated as we want it to be. Mainly made so roots don't touch each other and form loops
    root_isolated(environment){
        let all_directions = [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]];
        let root_particle_count = 0;
        for (let i = 0; i < 8; i++) {
            let particle_to_check = all_directions[i]
            if (environment.get(this.x + particle_to_check[0], this.y + particle_to_check[1]) instanceof RootParticle) {
                root_particle_count++
            }
            if (root_particle_count >= this.max_root_neighbours) {
                let soil_replacement_particle = new SoilParticle(this.x, this.y);
                environment.set(soil_replacement_particle);
                break
            }
        }
        this.has_checked_surroundings = true;
    }
}