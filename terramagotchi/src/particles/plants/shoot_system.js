import {
    DNANode,
    PlantFamilyParticle
} from ".";

import {
    Environment,
    NUTRIENT_ENERGY_RATIO,
    WATER_ENERGY_RATIO,
} from "../../environment";

// import { FastRandom } from "../../fast-random";

export class ShootSystemParticle extends PlantFamilyParticle {
    constructor(x, y, plant_dna=null) {
        /**
         * Superclass for all plant types which grow above-ground. Main purpose to better containerise 
         * the absorption functions which the class will override while allowing Seed/Root particles
         * to remain using the absorption code in organic.js
         * @param {Number}      x           Starting x-coordinate for new plant-type particle
         * @param {Number}      y           Starting y-coordinate for new plant-type particle
         * @param {DNANode}     plant_dna   A DNA Node in a DNA Tree describing the characteristics of this specific
         *                                      particle and its children
         */
        super(x, y, plant_dna);
    }

    absorb_water(environment) {
        /** 
         * Overriding the existing water absorption code to increase water transfer between plant particles
         * Forces a transfer between neighbouring plant particles if possible
         * @param {Environment}     environment     The current game environment
         */
        let target_amount = 5

        for (let row = -1; row < 2; row++) {
            for (let col = -1; col < 2; col++) {
                
                // Skip check when row = col = 0
                if (row | col == 0)
                    continue;
                
                // Prevent plant from transferring 
                if (this.__water_transferred || this.water_level + target_amount > this.water_capacity)
                    return;

                let target_particle = environment.get(this.x+col, this.y+row)

                // Check __water_transferred condition
                if (target_particle.__water_transferred)
                    continue
                
                if (!(target_particle instanceof PlantFamilyParticle))
                    continue

                if (target_particle.water_level > this.water_level && target_particle.water_level >= target_amount) {
                    
                    this.water_level += target_amount
                    target_particle.water_level -= target_amount
                    // Setting these to true slows absorption down to an unallowable level
                    // this.__water_transferred = true
                    // target_particle.__water_transferred = true
                    
                    // Break checking other neighbour types
                    break
                }
            }
        }
    }

    // Overriding nutrients absorption function
    absorb_nutrients(environment) {
        /** 
         * Overriding the existing nutrient absorption code to increase nutrient transfer between plant particles
         * Forces a transfer between neighbouring plant particles if possible
         * @param {Environment}                 environment             The current game environment
         * @param {Array<Array<Number>>}        _                       (DEPRECATED) List of potential neighbours to check from
         * @param {Array<ObjectConstructor>}    __                      (DEPRECATED) List of valid neighbour particle types to steal from
         * Deprecated parameters no longer used, parameters kept in function to maintain backwards compatibility
         */
        let target_amount = 5

        for (let row = -1; row < 2; row++) {
            for (let col = -1; col < 2; col++) {
                
                // Skip check when row = col = 0
                if (row | col == 0)
                    continue;
                
                // Prevent plant from transferring 
                if (this.__nutrient_transferred || this.nutrient_level + target_amount > this.nutrient_capacity)
                    return;

                let target_particle = environment.get(this.x+col, this.y+row)

                // Check __nutrient_transferred condition
                if (target_particle.__nutrient_transferred)
                    continue
                
                if (!(target_particle instanceof PlantFamilyParticle))
                    continue

                if (target_particle.nutrient_level > this.nutrient_level && target_particle.nutrient_level >= target_amount) {
                    
                    this.nutrient_level += target_amount
                    target_particle.nutrient_level -= target_amount
                    // Setting these to true slows absorption down to an unallowable level
                    // this.__nutrient_transferred = true
                    // target_particle.__nutrient_transferred = true
                    
                    // Break checking other neighbour types
                    break
                }
            }
        }
    }
}