import { AirParticle } from "..";
import { PlantParticleFamily } from "./plant";
import { Environment } from "../../environment";
import { DNANode } from "./plant_dna_node";
import { BarkParticle } from "./bark";
import { LeafParticle } from "./leaf";
import { FlowerParticle } from "./flower";

export class StemParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        /**
         * @param {Number}  x           (Integer) x-coordinate of particle to be constructed
         * @param {Number}  y           (Integer) y-coordinate of particle to be constructed
         * @param {DNANode} plant_dna   The DNA-node object for this plant particle. Represents a node in a tree graph.
         */
        super(x, y, plant_dna);

        this.__current_length = this.__current_length || 1
        this.__current_angle = this.dna.get_absolute_angle()
        this.__dx = 0
        this.__dy = 0
        // __growth_direction of type Array(2) = [offset_x, offset_y]
        this.__growth_direction = [0, 1]
    }

    update(environment) {
        this.absorb_nutrients(environment, this.__neighbours, this.__living_plant_particle_types)
        this.absorb_water(environment, this.__neighbours, this.__living_plant_particle_types)
        this.generate_energy()
        this.health_update(environment)
        
        if (this.is_active) {
            switch (this.dna.node_type) {
                case "stem":
                    this.stem_update(environment)
                    break
                case "flower":
                    this.flower_update(environment)
                    break
                case "leaf":
                    this.leaf_update(environment)
                    break
                default:
                    break
            }
        } else {    // Else so bark only grows if next stem cell has been grown
                    // this allows trees to prioritise growing vertically                                           
            this.bark_update(environment)
        }
    }

    stem_update(environment) {
        /**
         * Handles update function if the current particles dna node_type is "stem"
         * @param {Environment} environment     The current game environment
         */
        this.start_x = this.x - this.__dx
        this.start_y = this.y - this.__dy
        this.end_x = (this.start_x + this.dna.stem_length * Math.cos(this.__current_angle*Math.PI/180)) | 0
        this.end_y = (this.start_y + this.dna.stem_length * Math.sin(this.__current_angle*Math.PI/180)) | 0

        this.__growth_direction = this.calculate_growth_direction()

        if (this.__current_length == this.dna.stem_length) {
            this.grow_next_DNA_child(environment)
            return;
        }

        this.grow(environment)
    }

    bark_update(environment) {
        /**
         * Handles growing of bark
         * @param {Environment} environment     The current game environment
         */
        
         if (this.energy < this.activation_level)
            return;

        let current_stem_thickness = this.dna.stem_thickness -
            (((this.__current_length / this.dna.stem_length)) * (this.dna.stem_thickness - this.dna.stem_end_thickness) | 0) - 1

        let left_bark_angle = this.__current_angle + 90
        let right_bark_angle = this.__current_angle - 90

        this.left_bark_thickness = (current_stem_thickness / 2) | 0
        this.right_bark_thickness = ((current_stem_thickness / 2) + 0.6) | 0 // "0.6" could be any float in range [0.5, 1.0), 0.6 just felt safe

        if (this.dna.bark_start_direction == -1)
            [this.left_bark_thickness, this.right_bark_thickness] = [this.right_bark_thickness, this.left_bark_thickness]

        if (this.left_bark_thickness) {
            let left_neighbours_to_grow_bark = new Array()
            left_neighbours_to_grow_bark.push(this.convert_angle_to_offset(left_bark_angle))
            left_neighbours_to_grow_bark.push(this.convert_angle_to_offset(left_bark_angle + 45))
            // left_neighbours_to_grow_bark.push(this.convert_angle_to_offset(left_bark_angle - 45))

            for (let neighbour of left_neighbours_to_grow_bark) {
                let [offset_x, offset_y] = neighbour
                let target_particle = environment.get(this.x+offset_x, this.y+offset_y)

                if (target_particle instanceof AirParticle) {
                    let new_bark_particle = new BarkParticle(this.x+offset_x, this.y+offset_y, this.dna)
                    new_bark_particle.growth_angle = left_bark_angle
                    new_bark_particle.__current_length = 1
                    new_bark_particle.__thickness = this.left_bark_thickness

                    environment.set(new_bark_particle)
                    this.energy -= this.activation_level
                }
            }
        }
        
        if (this.right_bark_thickness) {
            let right_neighbours_to_grow_bark = new Array()
            right_neighbours_to_grow_bark.push(this.convert_angle_to_offset(right_bark_angle))
            // right_neighbours_to_grow_bark.push(this.convert_angle_to_offset(right_bark_angle + 45))
            right_neighbours_to_grow_bark.push(this.convert_angle_to_offset(right_bark_angle - 45))
            
            for (let neighbour of right_neighbours_to_grow_bark) {
                let [offset_x, offset_y] = neighbour
                let target_particle = environment.get(this.x+offset_x, this.y+offset_y)

                // if (target_particle instanceof AirParticle || (target_particle instanceof BarkParticle && (target_particle.__current_length > 1 || target_particle.__thickness < this.right_bark_thickness))) {
                if (target_particle instanceof AirParticle) {
                    let new_bark_particle = new BarkParticle(this.x+offset_x, this.y+offset_y, this.dna)
                    new_bark_particle.growth_angle = right_bark_angle
                    new_bark_particle.__current_length = 1
                    new_bark_particle.__thickness = this.right_bark_thickness

                    environment.set(new_bark_particle)
                    this.energy -= this.activation_level
                }
            }
        }
    }

    flower_update(environment) {
        let new_flower = new FlowerParticle(this.x, this.y, this.dna)
        new_flower.__current_length = 1
        environment.set(new_flower)
    }

    leaf_update(environment) {
        let new_leaf = new LeafParticle(this.x, this.y, this.dna)
        new_leaf.__current_length = 1
        environment.set(new_leaf)
    }

    grow(environment) {
        if (this.energy < this.activation_level)
            return;
        let [offset_x, offset_y] = this.__growth_direction
        if (this.dna.RANDOM_WEIGHT_GROWWTH_DIRECTION) {
            let random_rotation = this.weighted_random([-2, -1, 0, 1, 2], [0, 5, 100, 5, 0]);
            if (random_rotation != 0)
                [offset_x, offset_y] = this.get_rotated_offset(offset_x, offset_y, random_rotation)
        }
        let target_particle = environment.get(this.x+offset_x, this.y+offset_y)
        if (!(target_particle instanceof AirParticle || target_particle instanceof BarkParticle || (target_particle instanceof PlantParticleFamily && !target_particle.is_active)))
            return;
        let new_particle = new StemParticle(this.x + offset_x, this.y + offset_y, this.dna)
        new_particle.__dx = this.__dx + offset_x
        new_particle.__dy = this.__dy + offset_y
        new_particle.__current_length = this.__current_length + 1
        
        environment.set(new_particle)
        this.energy -= this.activation_level
        this.is_active = false
    }

    grow_next_DNA_child(environment) {
        /**
         * Handles sprouting children branches based on the current plant DNA nodes children
         * @param {Environment} environment     The current game environment
         */

        // keeping track of children to grow
        this.__unvisited_children = this.__unvisited_children || [...this.dna.children]
        if (this.__unvisited_children.length == 0) {
            this.is_active = false
            return;
        }
        
        if (this.energy < this.activation_level)
            return;

        let next_child_dna = this.__unvisited_children.shift()
        let child_growth_direction = this.convert_angle_to_offset(this.__current_angle + next_child_dna.stem_angle)
        
        // Maybe add weights
        let [offset_x, offset_y] = child_growth_direction
        let target_particle = environment.get(this.x + offset_x, this.y + offset_y)
        if (target_particle instanceof AirParticle || target_particle instanceof PlantParticleFamily && !target_particle.is_active) {
            let new_stem_particle = new StemParticle(this.x + offset_x, this.y + offset_y, next_child_dna)
            new_stem_particle.__dx = offset_x
            new_stem_particle.__dy = offset_y
            new_stem_particle.__current_length = 1

            environment.set(new_stem_particle)
            this.energy -= this.activation_level
        } else {
            this.__unvisited_children.push(next_child_dna)
        }
    }

    calculate_growth_direction(angle_offset=0) {
        /**
         * Returns which neighbour cell the stem will grow into
         * @param {Number}  angle_offset    (Optional) anlge offset from the current stem particle
         */
        let theta = this.__current_angle + angle_offset
        let [vector_x, vector_y] = this.create_vector_functions()

        if (this.__dx == 0 && this.__dy == 0)
            this.growth_angle = theta
        else
            this.growth_angle = Math.atan2(vector_y(this.__dy), vector_x(this.__dx))*180/Math.PI

        return this.convert_angle_to_offset(this.growth_angle)
    }

    create_vector_functions() {
        switch (this.dna.stem_curve) {
            case "spherical":
                let [centre_x, centre_y] = [this.start_x + this.dna.stem_length * Math.cos(this.__current_angle*Math.PI/180)/2,
                                    this.start_y + this.dna.stem_length * Math.sin(this.__current_angle*Math.PI/180)/2]
                let rotated_angle = this.__current_angle - 90
                centre_x += -this.dna.curve_direction * this.dna.curve_radius * Math.cos(rotated_angle*Math.PI/180)
                centre_y += -this.dna.curve_direction * this.dna.curve_radius * Math.sin(rotated_angle*Math.PI/180)

                let delta_x = this.x - centre_x
                let delta_y = this.y - centre_y
                
                return [((x) => -this.dna.curve_direction*delta_y), ((y) => this.dna.curve_direction*delta_x)]
            case "linear":
            default:
                return [((x) => this.end_x - (this.start_x + x)), ((y) => this.end_y - (this.start_y + y))]
        }
    }
}