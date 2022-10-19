import {
    generate_tree_dna,
    BarkParticle,
    DeadPlantParticle,
    DNANode,
    FlowerParticle,
    LeafParticle,
    RootParticle,
    StemParticle,
} from ".";

import {
    OrganicParticle,
    SoilParticle,
} from "..";

import {
    Environment,
    NUTRIENT_ENERGY_RATIO,
    WATER_ENERGY_RATIO,
} from "../../environment";

import { FastRandom } from "../../fast-random";


export class PlantFamilyParticle extends OrganicParticle {

    static DEFAULT_ACTIVATION_ENERGY = 0    // Default amount of energy required for a plant particle to grow
    static DEFAULT_MAX_HEALTH = 100         // Effectively how many frames a plant survives while "unhealthy" until dying
                                            // Can be set in DNA per-plant, else defaults to this value
                                        
    static MAX_ENERGY = 3                   // Maximum amount of energy a plant particle will contain
    static CREATE_ENERGY_PROBABILITY = 1    // Probability any given frame that energy will be produced in a plant containing sufficient water/nutrients
    
    static MIN_HEALTHY_WATER = 0            // Minimum amount of water to be considered "healthy"; will not create energy to go below
    static MIN_HEALTHY_NUTRIENTS = 0        // Minimum amount of nutrients to be considered "healthy"; will not create energy to go below

    static IS_NET_ZERO = true

    constructor(x, y, plant_dna=null) {
        /**
         * Superclass for all plant types, defines basic variables used homogeneously throughout the particle types
         * @param {Number}          x           Starting x-coordinate for new plant-type particle
         * @param {Number}          y           Starting y-coordinate for new plant-type particle
         * @param {DNANode | null}  plant_dna   A DNA Node in a DNA Tree describing the characteristics of this specific
         *                                      particle and its children
         */
        super(x, y);

        // Validate plant DNA-type. If invalid, create new DNA tree against default type
        this.dna = plant_dna
        if (this.dna == null) {
            let default_tree_dna = generate_tree_dna()
            this.dna = new DNANode(null, default_tree_dna)
        }

        // Default parameters for most plant-type particles
        this.moveable = false
        this.weight = 3
        this.color_variance = 0.05
        this.base_color = this.dna.color

        this.nutrient_capacity = 100
        this.water_capacity = 100

        this.energy_capacity =  (this.dna.max_energy != null) ? this.dna.max_energy : PlantFamilyParticle.MAX_ENERGY
        this.max_health =       (this.dna.max_health != null) ? this.dna.max_health : PlantFamilyParticle.DEFAULT_MAX_HEALTH

        
        
        this.activation_level = (this.dna.node_activation_level != null) ? this.dna.node_activation_level : PlantFamilyParticle.DEFAULT_ACTIVATION_ENERGY
        this.health =           (this.dna.max_health != null) ? this.dna.max_health : PlantFamilyParticle.DEFAULT_MAX_HEALTH
        this.energy = 0
        this.death_tick = -1

        this.is_active = true
        this.dead = false

        this.__neighbours = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]
        this.__current_length = 1
    }
    

    // Below are some common functions for plant-type particles
    generate_energy() {
        /**
         * Handles conversion between water/nutrient levels to particle usable "energy"
         * Energy is what a plant consumes to "grow", not the water/nutrients themselves
         * A plant will not convert water/nutrients to energy if that conversion will put itself
         * below a healthy level of water/nutrients
         */
        if (
            this.energy < this.energy_capacity &&
            this.water_level >= PlantFamilyParticle.MIN_HEALTHY_WATER + WATER_ENERGY_RATIO &&
            this.nutrient_level >= PlantFamilyParticle.MIN_HEALTHY_NUTRIENTS + NUTRIENT_ENERGY_RATIO &&
            FastRandom.random() < PlantFamilyParticle.CREATE_ENERGY_PROBABILITY // Makes energy more spontaneous feeling
                                                                                // Also acts to smooth the generation
        ) {
            this.water_level -= WATER_ENERGY_RATIO
            this.nutrient_level -= NUTRIENT_ENERGY_RATIO
            this.energy += 1
        }
    }

    health_update(environment) {
        /**
         * Keeps track of and updates the health-level of plants. Health will heal (increase) towards max_heatlh
         * when plant is healthy. Plant is unhealthy when below the "healthy" level of water/nutrients
         * @param {Environment} environment     Contains the current state of the application
         */
        if (this.dead)
            return this.die(environment)
        
        let damage_to_take = 0 // Represents how much health 
        if (this.water_level < PlantFamilyParticle.MIN_HEALTHY_WATER)
            damage_to_take++
        if (this.nutrient_level < PlantFamilyParticle.MIN_HEALTHY_NUTRIENTS)
            damage_to_take++
        
        if (damage_to_take == 0)
            this.health = Math.min(this.health + 2, this.max_health)
            
        this.health -= damage_to_take
        if (this.health <= 0)
            this.die(environment)
    }

    die(environment) {
        /**
         * Handles functionality of plant death. Stores first tick which the particle dies during.
         * A dead particle will kill all particles around itself if the particle is part of the same plant.
         * Death update on surrounding plants only happens on a tick after the first death tick to prevent
         * entire plant dying in 1 frame, and gives death a BFS-type "ripple effect" look
         * @param {Environment} environment     Contains the current state of the application
         */
        
        this.dead = true
        if (this.death_tick == -1)
            this.death_tick = environment.tick

        if (this.death_tick == environment.tick)
            return
            
        for (let [offset_x, offset_y] of this.__neighbours) {
            let target_particle = environment.get(this.x+offset_x, this.y+offset_y)
            if (
                target_particle instanceof PlantFamilyParticle &&
                !(target_particle instanceof DeadPlantParticle) &&
                !(target_particle instanceof RootParticle) &&
                !target_particle.dead &&
                this.dna.get_root() == target_particle.dna.get_root()
            ) 
                target_particle.die(environment)
        }
        let new_dead_plant = new DeadPlantParticle(this.x, this.y, this.dna)
        environment.set(new_dead_plant)
    }

    weighted_random(items, weights) {
        /**
         * Returns a random element from an array with a weighted probability of choice.
         * @param {Array<Object>} items     Array of items to choose from
         * @param {Array<Number>} weights   (Array) Sequence of weights
         */
        var i;

        for (i = 0; i < weights.length; i++)
            weights[i] += weights[i - 1] || 0;
        
        var random = FastRandom.random() * weights[weights.length - 1];
        
        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;
        
        return items[i];
    }

    get_rotated_offset(offset_x, offset_y, rotations=0) {
        /**
         * Takes values for an offset (which specifies a relative direction on a 2D grid),
         * returns the offset values for the nth neighbour (n=rotation)
         * @param {Number} offset_x     Integer in range [-1, 1]
         * @param {Number} offset_y     Integer in range [-1, 1]
         * @param {Number} rotations    Integer specifying which of n neighbouring directions to return.
         *                              Rotation direction is counter-clockwise
         */

        let theta = this.convert_offset_to_base_angle(offset_x, offset_y)
        theta += 45*rotations
        return this.convert_angle_to_offset(theta)
    }

    convert_offset_to_base_angle(offset_x, offset_y) {
        /**
         * Converts a given x, y directional offset ([-1 ... 1, -1 ... 1]) to the middle angle
         * required to produce that offset
         * @param {Number} offset_x     Integer in range [-1, 1]
         * @param {Number} offset_y     Integer in range [-1, 1]
         */

         let angle_delta = 45 // Essentially, the degrees difference between each offset
        if (offset_x==1 && offset_y==0)
            return 0
        if (offset_x==1 && offset_y==1)
            return angle_delta*1
        if (offset_x==0 && offset_y==1)
            return angle_delta*2
        if (offset_x==-1 && offset_y==1)
            return angle_delta*3
        if (offset_x==-1 && offset_y==0)
            return angle_delta*4
        if (offset_x==-1 && offset_y==-1)
            return angle_delta*5
        if (offset_x==0 && offset_y==-1)
            return angle_delta*6
        if (offset_x==1 && offset_y==-1)
            return angle_delta*7

        // Default case for unexpected offset_x/offset_y values will be upwards ([0, 1])
        return 90
    }

    convert_angle_to_offset(angle, radians=false) {
        /**
         * Converts a given angle (in degrees) to an x/y offset that closest matches the given angle
         * IMPORTANT: ANGLES MEASURED COUNTER-CLOCKWISE FROM X-AXIS LINE, ALWAYS
         * @param {Number}  angle   An angle (in degrees) to be converted
         * @param {Boolean} radians (default=false) Whether the given angle is in radians or not
         */

        // Convert angle to degrees if given in radians
        if (radians)
            angle *= (180/Math.PI)
        
        // Rounding angle down (truncating decimals)
        angle |= 0

        // Modulus math to put angle in range (0 <= angle < 360)
        // Verbose because range of JS modulo includes negative numbers. cringe tbh
        angle = ((angle % 360) + 360) % 360

        let angle_delta = 45 // The degrees difference between each offset (every 45 degrees is a new "offset" x/y)

        if (angle < 22.5)
            return [1, 0]
        else if (angle < 22.5 + angle_delta*1)
            return [1, 1]
        else if (angle < 22.5 + angle_delta*2)
            return [0, 1]
        else if (angle < 22.5 + angle_delta*3)
            return [-1, 1]
        else if (angle < 22.5 + angle_delta*4)
            return [-1, 0]
        else if (angle < 22.5 + angle_delta*5)
            return [-1, -1]
        else if (angle < 22.5 + angle_delta*6)
            return [0, -1]
        else if (angle < 22.5 + angle_delta*7)
            return [1, -1]
        // swag logic, no else needed
        return [1, 0]
    }





    
    // Debug colouring code
    // get_color(s) {
    //     if (this.nutrient_capacity != 0) {
    //         s.push()
    //         s.colorMode(s.RGB)
    //     //    this.color = s.color((this.water_level - 30) * 10)
    //         let red = 255*(this.nutrient_level/this.nutrient_capacity)
    //         let blue = 255*(this.water_level/this.water_capacity)
    //         this.color = s.color(red, 0, blue)
            
    //         s.pop()
    //         return this.color
    //     }

    //     // Initialise colour if needed
    //     if (this.color === "#000000") {
    //         super.get_color(s);
    //     }

    //     this.color = s.color(
    //         s.hue(this.color),
    //         s.saturation(this.base_color) * this.saturation_offset,
    //         s.brightness(this.base_color) * this.brightness_offset -
    //             this.water_level / 4
    //     );
    //     return this.color;
    // }
}