import { BaseParticle } from "./base";

export class OrganicParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);

        this.__nutrient_level = 0;
        this.nutrient_capacity = 100;
        this.__nutrient_render_step = 5;

        this.__water_level = 50;
        this.water_capacity = 100;
        this.__water_render_step = 5;

        this.__water_transferred = false;
        this.__water_transferred = false;
    }

    set water_level(level) {

        if (Math.floor(this.__water_level / this.__water_render_step) != Math.floor(level / this.__water_render_step)) {
            this.rerender = true;
        }

        this.__water_level = level;
    }

    set nutrient_level(level) {

        if (Math.floor(this.__nutrient_level / this.__nutrient_render_step) != Math.floor(level / this.__nutrient_render_step)) {
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
    }

    absorb_water(environment, potential_neighbours, valid_neighbour_types) {
        // Choose random neighbour
        let [offset_x, offset_y] = potential_neighbours[Math.floor(Math.random()*potential_neighbours.length)];
        let random_neighbour = environment.get(this.x + offset_x, this.y + offset_y);
        
        //let transfer_amount = 5;
        let transfer_amount = Math.floor(Math.random() * 10);
        //let transfer_amount = Math.floor((random_neighbour.water_level - this.water_level) / (1.5 + Math.random()));

        // Attempt to absorb water from random organic neighbour
        if (random_neighbour instanceof OrganicParticle && 
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

    get_color(s) {
                s.brightness(this.base_color) * this.brightness_offset - this.__water_level / 6
            )
            this.do_update_color = false;
        } else {
        //s.push()
        //s.colorMode(s.RGB)
        //this.color = s.color(this.water_level / (100/255))
        //s.pop()
        //return this.color

        // Initialise colour if needed
        if (this.color === "#000000") {
            super.get_color(s);
        }

        this.color = s.color(
            s.hue(this.color),
            s.saturation(this.base_color) * this.saturation_offset + this.nutrient_level / 4,
            s.brightness(this.base_color) * this.brightness_offset - this.water_level / 4
        )
        return this.color;
    }
}