export class BaseParticle {
    constructor(x, y) {
        if (x == undefined || y == undefined) throw "x and y are required parameters."
        this.x = x
        this.y = y

        this.base_color = "#000000";
        this.color = "#000000";
        this.color_variance = 0.05;
        this.saturation_offset = 0;
        this.brightness_offset = 0; // Purely for organic particles wetness visual currently

        this.weight = 0;
        this.last_tick = 0;

        /* Moveable: Describes whether a particle can be displaced due to any process
            Includes gravity and erosion 
            Protects plants/leaves from have heavy particles fall through */
        this.moveable = false;
        this.do_update_color = false;

        /** moveable_x and moveable_y describe whether, in a given frame, the particle
         * has the ability to move across the x or y axis */
        this.moveable_x = false;
        this.moveable_y = false;
    }

    // Reset all tick-sensitive variables
    refresh() {
        if (this.moveable) {
            this.moveable_x = true;
            this.moveable_y = true;
        }
    }

    update(environment) {}

    compute_gravity(environment) {
        /**
         * Gravity update function. Moves particles down if
         *      The particle below is moveable, and
         *      The particle below has a lower weight
         * Sets moveable flag to false for both after move so particles cannot move
         * twice in one update
         */
        const particle_below = environment.get(this.x, this.y - 1);
        if (this.moveable_y && particle_below.moveable_y && this.weight > particle_below.weight) {
            this.moveable_y = false;
            particle_below.moveable_y = false;
            environment.swap(this.x, this.y, this.x, this.y - 1);
        }
    }

    compute_erosion(environment) {
        /**
         * Prevents single-cell hills from forming through artificial erosion
         */
        if (
            this.moveable_y &&
            environment.get(this.x - 1, this.y + 1).weight < this.weight &&
            environment.get(this.x, this.y + 1).weight < this.weight &&
            environment.get(this.x + 1, this.y + 1).weight < this.weight
        ) {
            let free_neighbours = [0];

            if (
                environment.get(this.x - 1, this.y).moveable_x &&
                environment.get(this.x - 1, this.y).weight < this.weight &&
                environment.get(this.x - 1, this.y - 1).weight < this.weight
            )
                free_neighbours.push(-1);

            if (
                environment.get(this.x + 1, this.y).moveable_x &&
                environment.get(this.x + 1, this.y).weight < this.weight &&
                environment.get(this.x + 1, this.y - 1).weight < this.weight
            )
                free_neighbours.push(+1);

            if (free_neighbours.length > 1) {
                let offset =
                    free_neighbours[
                        Math.floor(Math.random() * free_neighbours.length)
                    ];
                if (offset != 0) {
                    this.moveable_x = false;
                    environment.get(this.x + offset, this.y).moveable_x = false;
                    environment.swap(this.x, this.y, this.x + offset, this.y);
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
