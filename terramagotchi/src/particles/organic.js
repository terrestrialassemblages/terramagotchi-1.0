import { Environment } from "../environment";
import { FastRandom } from "../fast-random";
import { AirParticle } from "./air";
import { BaseParticle } from "./base";
import { SteamParticle } from "./steam";

export class OrganicParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        
        this.moveable = true;
        this.weight = 2;

        this.__nutrient_level = 0;
        this.nutrient_capacity = 100
        this.__nutrient_render_step = 100;
        this.__last_rendered_nutrient_level = 0;

        this.__water_level = 0;
        this.water_capacity = 100;
        this.__water_render_step = FastRandom.int_min_max(10, 20);
        this.__last_rendered_water_level = 0;

        this.__water_transferred = false;
        this.__nutrient_transferred = false;

        // Per-tick chance for transpiration (evaporate water_level into steam)
        this.transpiration_chance = 0.00002;
    }

    set water_level(level) {
        if (Math.abs(this.water_level - this.__last_rendered_water_level) >= this.__water_render_step) {
            this.rerender = true;
            this.__last_rendered_water_level = this.water_level;
        }

        this.__water_level = level;
    }

    set nutrient_level(level) {
        if (Math.abs(this.nutrient_level - this.__last_rendered_nutrient_level) >= this.__nutrient_render_step) {
           this.rerender = true;
           this.__last_rendered_nutrient_level = this.nutrient_level;
        }

        this.__nutrient_level = level;
    }

    get water_level() {
        return this.__water_level;
    }

    get nutrient_level() {
        return this.__nutrient_level;
    }

    refresh() {
        super.refresh();
        this.__water_transferred = false;
        this.__nutrient_transferred = false;
    }

    absorb_from_neighbours(environment, potential_neighbours, valid_neighbour_types) {
        /**
         * Handles how organic particles absorb water/nutrients from neighbouring particles
         * Selects random neighbour from list of potential_neighbours and checks if the neighbours "type" is valid
         * If valid, attempts water & nutrient absorption
         * @param {Environment}                 environment             The current environment-state of the application
         * @param {Array<Array<Number>>}        potential_neighbours    Array of neighbours to check for absorption
         * @param {Array<Array<BaseParticle>>}  valid_neighbour_types   Array of valid particle-types of neighbours to absorb fromn
         */

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

        // Absorb water and nutrients from valid neighbour
        if (neighbour_valid_type) {
            this.absorb_water(random_neighbour)
            this.absorb_nutrients(random_neighbour)
        }
    }

    absorb_water(neighbour) {
        /**
         * Handles default water-absorption behaviour of organic particles
         * @param {BaseParticle}    neighbour   A neighbouring particle of a valid particle-type to absorb from
         */
        
        // How much water to transfer
        // Absorb up to 10 water or up to half the difference between levels if lower
        let transfer_amount = Math.min(FastRandom.int_max(10), ((neighbour.water_level - this.water_level) / 2) | 0)
        // Only absorb as much as the capacity will allow
        transfer_amount = Math.min(transfer_amount, this.water_capacity - this.water_level)

        // Attempt to absorb water from random neighbour
        if (transfer_amount > 0 &&
            FastRandom.random() < (transfer_amount / 10) &&
            !neighbour.__water_transferred &&
            !this.__water_transferred
        ) {
            // Transfer water
            this.water_level += transfer_amount;
            neighbour.water_level -= transfer_amount;

            // Ensure water is not transfered again this tick
            this.__water_transferred = true;
            neighbour.__water_transferred = true;
        }
    }

    absorb_nutrients(neighbour) {
        /**
         * Handles default nutrient-absorption behaviour of organic particles
         * @param {BaseParticle}    neighbour   A neighbouring particle of a valid particle-type to absorb from
         */

        // How much nutrients to transfer
        // Absorb half of the difference between levels (rounded up), or as much as possible if the capacity is too low
        let transfer_amount = Math.min(((((neighbour.nutrient_level - this.nutrient_level) / 2) + 0.999) | 0), this.nutrient_capacity - this.nutrient_level);

        // Attempt to absorb nutrients from random neighbour
        if (transfer_amount > 0 &&
            !neighbour.__nutrient_transferred &&
            !this.__nutrient_transferred
        ) {
            // Transfer nutrients
            this.nutrient_level += transfer_amount;
            neighbour.nutrient_level -= transfer_amount;

            // Ensure nutrients is not transfered again this tick
            this.__nutrient_transferred = true;
            neighbour.__nutrient_transferred = true;
        }
    }

    compute_transpiration(environment) {
        // Evaporate water_level into steam in correct conditions
        if (FastRandom.random() < this.transpiration_chance &&
            environment.get(this.x, this.y + 1) instanceof AirParticle &&
            !environment.is_raining &&
            this.water_level > 0 && 
            environment.light_level == 100) {

            // Create new steam particle
            environment.set(new SteamParticle(this.x, this.y + 1, this.water_level))
            // Remove water_level
            this.water_level = 0
        }
    }

    get_color(s) {

        // s.push()
        // s.colorMode(s.RGB)
        // this.color = s.color((this.water_level - 30) * 10)
        // let red = 255*(this.nutrient_level/((this.nutrient_capacity == 0) ? 255 : this.nutrient_capacity))
        // let blue = 255*(this.water_level/((this.water_capacity == 0) ? 255 : this.water_capacity))
        // this.color = s.color(red, 0, blue)
        
        // s.pop()
        // return this.color

        // Initialise colour if needed
        if (this.color === "#FF00FF") {
            super.get_color(s);
        }

        this.color = s.color(
            s.hue(this.color),
            s.saturation(this.base_color) * this.saturation_offset,
            s.brightness(this.base_color) * this.brightness_offset -
                Math.min(this.water_level, this.water_capacity) / 4
        );
        return this.color;
    }
}
