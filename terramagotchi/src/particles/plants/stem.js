import {
    BarkParticle,
    DNANode,
    FlowerParticle,
    LeafParticle,
    PlantFamilyParticle,
} from ".";

import { ShootSystemParticle } from "./shoot_system";

import { AirParticle } from "..";

import { Environment, NUTRIENT_ENERGY_RATIO, WATER_ENERGY_RATIO } from "../../environment";

export class StemParticle extends ShootSystemParticle {
    /**
     * StemParticles are the main plant structure, creating the shape/branches/curves of a tree
     * All other types of plant particles spawn from these particle types (see below)
     * @param {Number}  x           (Integer) x-coordinate of particle to be constructed
     * @param {Number}  y           (Integer) y-coordinate of particle to be constructed
     * @param {DNANode} plant_dna   The DNA-node object for this plant particle. Represents a node in a tree graph.
     */
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);

        this.__current_length = 1
        this.__current_angle = this.dna.get_absolute_angle()
        this.__dx = 0
        this.__dy = 0
    }

    /**
     * Handles update function for the seed particle
     * @param {Environment} environment     The current game environment
     */
    update(environment) {
        this.health_update(environment)

        if (this.dead) return;
        
        this.absorb_nutrients(environment)
        this.absorb_water(environment)
        this.generate_energy()
        
        if (this.is_active)
            this.stem_update(environment)
        else                                          
            this.bark_update(environment) // Only grows bark if next children have been grown
    }

    /**
     * Handles updating the stem_particle while the particle is active
     * @param {Environment} environment     The current game environment
     */
    stem_update(environment) {
        this.start_x =  this.start_x || this.x - this.__dx
        this.start_y =  this.start_u || this.y - this.__dy
        this.end_x =    this.end_x || (this.start_x + this.dna.stem_length * Math.cos(this.__current_angle*Math.PI/180)) | 0
        this.end_y =    this.end_y || (this.start_y + this.dna.stem_length * Math.sin(this.__current_angle*Math.PI/180)) | 0

        // Represents the "offset" x/y pair of values which best fits to the growth curve
        this.__growth_direction = this.__growth_direction || this.calculate_growth_direction()

        if (this.__current_length == this.dna.stem_length)
            this.grow_next_DNA_child(environment)
        else
            this.grow(environment)
    }

    /**
     * Handles growing of bark
     * @param {Environment} environment     The current game environment
     */
    bark_update(environment) {
        if (this.energy < this.activation_level || this.dead)
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
                    new_bark_particle.absorb_tier = this.absorb_tier - 2

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
                    new_bark_particle.absorb_tier = this.absorb_tier - 2

                    environment.set(new_bark_particle)
                    this.energy -= this.activation_level
                }
            }
        }
    }

    /**
     * Handles growing continuous growing of stem particles from the current stem
     * @param {Environment} environment     The current game environment
     */
    grow(environment) {
        if (this.energy < this.activation_level ||
            this.water_level < 2*PlantFamilyParticle.MIN_HEALTHY_WATER ||
            this.nutrient_level < 2*PlantFamilyParticle.MIN_HEALTHY_NUTRIENTS
            )
            return;
        
        // Chooses random-weighted neighbour of the growth_direction
        let [offset_x, offset_y] = this.__growth_direction
        if (this.dna.RANDOM_WEIGHT_GROWWTH_DIRECTION) {
            let random_rotation = this.weighted_random([-2, -1, 0, 1, 2], [0, 5, 100, 5, 0]);
            if (random_rotation != 0)
                [offset_x, offset_y] = this.get_rotated_offset(offset_x, offset_y, random_rotation)
        }

        let target_particle = environment.get(this.x+offset_x, this.y+offset_y)
        if (!(target_particle instanceof AirParticle || target_particle instanceof BarkParticle || (target_particle instanceof PlantFamilyParticle && !target_particle.is_active)))
            return;
        
        let new_particle = new StemParticle(this.x + offset_x, this.y + offset_y, this.dna)

        new_particle.nutrient_level = PlantFamilyParticle.MIN_HEALTHY_NUTRIENTS
        new_particle.water_level = PlantFamilyParticle.MIN_HEALTHY_WATER
        this.nutrient_level -= PlantFamilyParticle.MIN_HEALTHY_NUTRIENTS
        this.water_level -= PlantFamilyParticle.MIN_HEALTHY_WATER

        new_particle.__dx = this.__dx + offset_x
        new_particle.__dy = this.__dy + offset_y
        new_particle.__current_length = this.__current_length + 1
        new_particle.absorb_tier = this.absorb_tier + 1

        environment.set(new_particle)

        if (PlantFamilyParticle.IS_NET_ZERO) {
            this.nutrient_level += this.activation_level * NUTRIENT_ENERGY_RATIO
            this.water_level += this.activation_level * WATER_ENERGY_RATIO
        }
        this.energy -= this.activation_level
        this.is_active = false
    }

    /**
     * Handles growing children branches based on the current plant DNA nodes children
     * @param {Environment} environment     The current game environment
     */
    grow_next_DNA_child(environment) {
        // Keeping track of children to grow
        this.__unvisited_children = this.__unvisited_children || [...this.dna.children]
        if (this.__unvisited_children.length == 0) {
            this.is_active = false
            return;
        }
        
        if (this.energy < this.activation_level ||
            this.water_level < 2*PlantFamilyParticle.MIN_HEALTHY_WATER ||
            this.nutrient_level < 2*PlantFamilyParticle.MIN_HEALTHY_NUTRIENTS
            )
            return;

        let next_child_dna = this.__unvisited_children.shift()
        let child_growth_direction = this.convert_angle_to_offset(next_child_dna.get_absolute_angle())
        
        // Weighted-random selection of offsets from the base offset and its neighbours
        let [offset_x, offset_y] = child_growth_direction
        if (next_child_dna.children_weight_growth_direction) {
            let random_rotation = this.weighted_random([-2, -1, 0, 1, 2], [0, 5, 100, 5, 0]);
            if (random_rotation != 0)
                [offset_x, offset_y] = this.get_rotated_offset(offset_x, offset_y, random_rotation)
        }

        let target_particle = environment.get(this.x + offset_x, this.y + offset_y)
        if (target_particle instanceof AirParticle || target_particle instanceof BarkParticle || target_particle instanceof PlantFamilyParticle && !target_particle.is_active) {
            let ParticleType = StemParticle
            if (next_child_dna.node_type == "leaf")
                ParticleType = LeafParticle
            else if (next_child_dna.node_type == "flower")
                ParticleType = FlowerParticle

            let new_child_particle = new ParticleType(this.x + offset_x, this.y + offset_y, next_child_dna)

            new_child_particle.nutrient_level = PlantFamilyParticle.MIN_HEALTHY_NUTRIENTS
            new_child_particle.water_level = PlantFamilyParticle.MIN_HEALTHY_WATER
            this.nutrient_level -= PlantFamilyParticle.MIN_HEALTHY_NUTRIENTS
            this.water_level -= PlantFamilyParticle.MIN_HEALTHY_WATER
            
            new_child_particle.__dx = offset_x
            new_child_particle.__dy = offset_y
            new_child_particle.__current_length = 1
            new_child_particle.absorb_tier = this.absorb_tier + 1

            if (PlantFamilyParticle.IS_NET_ZERO) {
                this.nutrient_level = this.activation_level * NUTRIENT_ENERGY_RATIO
                this.water_level = this.activation_level * WATER_ENERGY_RATIO
            }
            this.energy -= this.activation_level

            environment.set(new_child_particle)
        } else {
            this.__unvisited_children.push(next_child_dna)
        }
    }

    /**
     * Returns which neighbour cell the stem will grow into
     * @param {Number}  angle_offset    (Optional) anlge offset from the current stem particle
     */
    calculate_growth_direction(angle_offset=0) {
        let theta = this.__current_angle + angle_offset
        let [vector_x, vector_y] = this.create_vector_functions()
        let calculate_error = this.create_error_calculation_function()

        if (this.__dx == 0 && this.__dy == 0)
            this.growth_angle = theta
        else
            this.growth_angle = Math.atan2(vector_y(this.__dy), vector_x(this.__dx))*180/Math.PI
        
        let base_direction = this.convert_angle_to_offset(this.growth_angle)
        let potential_directions = [base_direction]
        potential_directions.push(this.get_rotated_offset(potential_directions[0], potential_directions[1], 1))
        potential_directions.push(this.get_rotated_offset(potential_directions[0], potential_directions[1], -1))

        let best = null
        let best_error = Infinity
        for (let direction of potential_directions) {
            let temp_error = calculate_error(direction[0], direction[1])
            if (temp_error < best_error) {
                best_error = temp_error
                best = direction
            }
        }
        
        return best
    }

    /**
     * Returns callback functions for a particle
     * Implementation mimicks a Vector Field, where each point in the 2D grid corresponds to a vector
     * The vector points in the direction which matches the curve-type of the stem
     * @returns {Array<Function>}   Array of callback functions which define a vector field
     */
    create_vector_functions() {
        switch (this.dna.stem_curve) {
            case "spherical":
                let centre_x = this.start_x + this.dna.stem_length * Math.cos(this.__current_angle*Math.PI/180)/2
                let centre_y = this.start_y + this.dna.stem_length * Math.sin(this.__current_angle*Math.PI/180)/2

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

    /**
     * Returns callback functions for calculating errors when deciding growth direction
     * Error = relative measure of distance of a particle from matching it's "ideal path"
     * For example, the spherical "error" is the distance of a particle from a circle's circumference
     * @returns {Function}   Callback function which define an error calculation function
     */
    create_error_calculation_function() {
        switch (this.dna.stem_curve) {
            case "spherical":
                let centre_x = this.start_x + this.dna.stem_length * Math.cos(this.__current_angle*Math.PI/180)/2
                let centre_y = this.start_y + this.dna.stem_length * Math.sin(this.__current_angle*Math.PI/180)/2

                let rotated_angle = this.__current_angle - 90
                centre_x += -this.dna.curve_direction * this.dna.curve_radius * Math.cos(rotated_angle*Math.PI/180)
                centre_y += -this.dna.curve_direction * this.dna.curve_radius * Math.sin(rotated_angle*Math.PI/180)

                return ((x, y) => {
                    let distance_from_centre = (centre_x - (this.x + x)) ** 2 + (centre_y - (this.y + y)) ** 2
                    let radius2 = (this.start_x - centre_x - 1) ** 2 + (this.start_y - centre_y) ** 2
                    
                    return Math.abs(radius2 - distance_from_centre)
                })
            case "linear":
            default:
                return (x, y) => (
                    (this.end_x - (this.x + x)) ** 2 + (this.end_y - (this.y + y)) ** 2
                )
        }
    }
}