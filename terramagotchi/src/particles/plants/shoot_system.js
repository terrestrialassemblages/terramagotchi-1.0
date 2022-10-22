import { PlantFamilyParticle } from "./plant";
import { DNANode } from "./plant_dna_node";

import {
    Environment,
    NUTRIENT_ENERGY_RATIO,
    WATER_ENERGY_RATIO,
} from "../../environment";
import { RootParticle } from "./root";
import { FastRandom } from "../../fast-random";

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

        this.nutrient_capacity = 15
        this.water_capacity = 15
        this.__transfer_smoothing_constant = 3/4
    }


    absorb_water(environment, is_safe=true) {
        /**
         * Handles how ShootSystemParticles absorb water from neighbouring particles
         * @param {Environment} environment     The current environment in the application
         */
        let target_amount = 3
        for (let neighbour of this.__neighbours) {
            let [offset_x, offset_y] = neighbour
            if (this.__water_transferred || this.water_level + target_amount > this.water_capacity)
                return;
            
            let target_particle = environment.get(this.x+offset_x, this.y+offset_y)

            if (
                !(target_particle instanceof PlantFamilyParticle) ||
                target_particle.__nutrient_transferred ||
                target_particle.absorb_tier > this.absorb_tier ||
                (target_particle.water_level - target_amount <= PlantFamilyParticle.MIN_HEALTHY_WATER && is_safe) ||
                FastRandom.random() > this.__transfer_smoothing_constant
                )
                continue
            
            if (target_particle instanceof RootParticle)
                target_amount = Math.min(target_particle.water_level, this.water_capacity - this.water_level)

            if ((target_particle.water_level > this.water_level || target_particle instanceof RootParticle) && target_particle.water_level >= target_amount) {
                this.water_level += target_amount
                target_particle.water_level -= target_amount
            }
                
        }
    }


    absorb_nutrients(environment, is_safe=true) {
        /**
         * Handles how ShootSystemParticles absorb nutrients from neighbouring particles
         * @param {Environment} environment     The current environment in the application
         */
        let target_amount = 3
        for (let neighbour of this.__neighbours) {
            let [offset_x, offset_y] = neighbour
            if (this.__nutrient_transferred || this.nutrient_level + target_amount > this.nutrient_capacity)
                return;
            
            let target_particle = environment.get(this.x+offset_x, this.y+offset_y)

            if (
                !(target_particle instanceof PlantFamilyParticle) ||
                target_particle.__nutrient_transferred ||
                target_particle.absorb_tier > this.absorb_tier ||
                (target_particle.nutrient_level - target_amount <= PlantFamilyParticle.MIN_HEALTHY_NUTRIENTS && is_safe) ||
                FastRandom.random() > this.__transfer_smoothing_constant
                )
                continue
            
                if (target_particle instanceof RootParticle)
                    target_amount = Math.min(target_particle.nutrient_level, this.nutrient_capacity - this.nutrient_level)
            

            if ((target_particle.nutrient_level > this.nutrient_level || target_particle instanceof RootParticle) && target_particle.nutrient_level >= target_amount) {
                this.nutrient_level += target_amount
                target_particle.nutrient_level -= target_amount
            }
                
        }
    }
}