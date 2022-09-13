import { BaseParticle } from "./base";

// WATER_LEVEL_COLOR_BRIGHTNESS_FACTOR : how much brightness gets removed
// from a particles colour when fully saturated
// When water_level == water_capacity, brightness = color.brightness - WATER_LEVEL_COLOR_BRIGHTNESS_FACTOR
const WATER_LEVEL_COLOR_BRIGHTNESS_FACTOR = 15

export class OrganicParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);

        this.__nutrient_level = 0;
        this.nutrient_capacity = 100;
3
        this.__water_level = 0;
        this.water_capacity = 100;

        this.__rerender_threshold = 7
        this.__water_transferred = false;
        this.__nutrient_transferred = false;

        this.__transfer_difference_minimum = 3
    }

    set water_level(level) {

        if ((this.__water_level / this.__rerender_threshold >> 0) != (level / this.__rerender_threshold >> 0)) {
            this.rerender = true;
        }

        this.__water_level = level;
    }

    set nutrient_level(level) {

        if ((this.__nutrient_level / this.__rerender_threshold >> 0) != (level / this.__rerender_threshold >> 0)) {
            this.rerender = true;
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

    absorb_water(environment, valid_neighbour_types) {
        // Choose random neighbour
        let [offset_x, offset_y] = [[0, 1], [1, 0], [0, -1], [-1, 0]][Math.random() * 4 >> 0];
        let random_neighbour = environment.get(this.x + offset_x, this.y + offset_y);

        // Check if random neighbour is a valid type (feel free to rewrite implementation)
        let neighbour_valid_type = false;
        for (const valid_type of valid_neighbour_types) {
            if (random_neighbour instanceof valid_type) {
                neighbour_valid_type = true;
                break;
            }
        }

        // Method 1
        let transfer_amount = 1;
        // Method 2
        // let transfer_amount = Math.floor(Math.random() * 10);
        // Method 3
        //let transfer_amount = Math.floor((random_neighbour.water_level - this.water_level) / (1.5 + Math.random()));

        // Attempt to absorb water from random neighbour
        if (neighbour_valid_type && 
            this.water_level + transfer_amount <= this.water_capacity && 
            random_neighbour.water_level >= transfer_amount && 
            this.water_level + transfer_amount < random_neighbour.water_level &&
            !random_neighbour.__water_transferred &&
            !this.__water_transferred) {

            // Transfer water
            this.water_level += Math.max(transfer_amount, 1);
            random_neighbour.water_level -= Math.max(transfer_amount, 1);

            // Ensure water is not transfered again this tick
            this.__water_transferred = true;
            random_neighbour.__water_transferred = true;
        }
    }

    absorb_nutrients(environment, valid_neighbour_types) {
        // Choose random neighbour
        let [offset_x, offset_y] = [[0, 1], [1, 0], [0, -1], [-1, 0]][Math.random() * 4 >> 0];
        let random_neighbour = environment.get(this.x + offset_x, this.y + offset_y);

        // Check if random neighbour is a valid type (feel free to rewrite implementation)
        let neighbour_valid_type = false;
        for (const valid_type of valid_neighbour_types) {
            if (random_neighbour instanceof valid_type) {
                neighbour_valid_type = true;
                break;
            }
        }

        // Method 1
        let transfer_amount = 1;
        // Method 2
        //let transfer_amount = Math.floor(Math.random() * 2);
        // Method 3
        // let transfer_amount = Math.floor((random_neighbour.nutrient_level - this.nutrient_level) / (1.5 + Math.random()));

        // Attempt to absorb nutrient from random neighbour
        if (neighbour_valid_type && 
            this.nutrient_level + transfer_amount <= this.nutrient_capacity && 
            random_neighbour.nutrient_level >= transfer_amount && 
            this.nutrient_level + transfer_amount < random_neighbour.nutrient_level &&
            !random_neighbour.__nutrient_transferred &&
            !this.__nutrient_transferred) {

            // Transfer nutrient
            this.nutrient_level += Math.max(transfer_amount, 1);
            random_neighbour.nutrient_level -= Math.max(transfer_amount, 1);

            // Ensure nutrient is not transfered again this tick
            this.__nutrient_transferred = true;
            random_neighbour.__nutrient_transferred = true;
        }
    }

    get_color(s) {

        //if (this.nutrient_capacity != 0) {
        //    s.push()
        //    s.colorMode(s.RGB)
        //    //this.color = s.color((this.water_level - 30) * 10)
        //    this.color = s.color((this.nutrient_level - 30) * 10)
        //    s.pop()
        //    return this.color
        //}

        // Initialise colour if needed
        if (this.color === "#000000") {
            super.get_color(s);
        }

        this.color = s.color(
            s.hue(this.color),
            s.saturation(this.base_color) * this.saturation_offset,
            s.brightness(this.base_color) * this.brightness_offset - WATER_LEVEL_COLOR_BRIGHTNESS_FACTOR  * this.water_level / this.water_capacity
        )
        return this.color;
    }
}