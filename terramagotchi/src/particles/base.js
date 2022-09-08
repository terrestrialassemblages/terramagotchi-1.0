export class BaseParticle {
    constructor() {
        this.base_color = "#000000";
        this.color_variance = 0.05;

        this.last_tick = 0

        /* Moveable: Describes whether a particle can be displaced due to any process
            Includes gravity and erosion 
            Protects plants/leaves from have heavy particles fall through */
        this.moveable = false;
        this.weight = 0;
        this.color = this.base_color;
        this.saturation_offset = 0;
        this.brightness_offset = 0; // Purely for organic particles wetness visual currently
        this.do_update_color = false;

        /** moveable_x and moveable_y describe whether, in a given frame, the particle
         * has the ability to move across the x or y axis */
        this.moveable_x = false;
        this.moveable_y = false;
    }

    update(x, y, environment) {}

    compute_gravity(x, y, environment) {
        /**
         * Gravity update function. Moves particles down if
         *      The particle below is moveable, and
         *      The particle below has a lower weight
         * Sets moveable flag to false for both after move so particles cannot move
         * twice in one update
         */
        this.moveable_y = true
        let particle_below = environment.get(x, y-1)
        if (particle_below.moveable_y && this.weight > particle_below.weight) {
            particle_below.moveable_y = false;
            this.moveable_y = false;
            environment.swap(x, y, x, y-1);
        }
    }

    compute_erosion(x, y, environment) {
        /**
         * Prevents single-cell hills from forming through artificial erosion
         */
        if (environment.get(x-1,y+1).weight < this.weight && environment.get(x,y+1).weight < this.weight && environment.get(x+1,y+1).weight < this.weight) {
            let free_neighbours = [0]
            if (environment.get(x-1, y).moveable_x && environment.get(x-1, y).weight < this.weight && environment.get(x-1, y-1).weight < this.weight)
                free_neighbours.push(-1)
            if (environment.get(x+1, y).moveable_x && environment.get(x+1, y).weight < this.weight && environment.get(x+1, y-1).weight < this.weight)
                free_neighbours.push(+1)
            if (free_neighbours.length > 1) {
                let offset = free_neighbours[Math.floor(Math.random()*free_neighbours.length)];
                if (offset != 0) {
                    this.moveable_x = false
                    environment.get(x+offset, y).moveable_x = false
                    environment.swap(x, y, x+offset, y)
                }
            }
        }
    }

    // Function to initalise random colour variation and update colour when needed
    get_color(s) {
        // If color is uninitialised, randomise it based on color_variance
        if (this.color === "#000000") {
            let c = s.color(this.base_color);
            let min = 1 - this.color_variance;
            let max = 1 + this.color_variance;
            this.brightness_offset = Math.random() * (max - min) + min;
            this.saturation_offset = Math.random() * (max - min) + min;

            c = s.color(
                s.hue(c),
                s.saturation(c) * this.saturation_offset,
                s.brightness(c) * this.brightness_offset
            );
            this.color = c;
        }
        return this.color;
    }
}