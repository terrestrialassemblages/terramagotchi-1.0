import { FastRandom } from "../fast-random";

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

        this.weight = 3;

        // Particle is AirParticle
        this.empty = false;
        // Particle is currently passing through other particles in the grid
        this.passing_through = false;
        // The list of particle class types that a particle can pass through
        this.pass_through_types = [];

        /* Moveable: Describes whether a particle can be displaced due to any process
            Includes gravity and erosion 
            Protects plants/leaves from have heavy particles fall through */
        this.moveable = false;
        /** moveable_x and moveable_y describe whether, in a given frame, the particle
         * has the ability to move across the x or y axis */
        this.moveable_x = false;
        this.moveable_y = false;

        this.destroyed = false;
        this.rerender = true;
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

        this.attempt_pass_through(this.x, this.y - 1, environment);

        const particle_below = environment.get(this.x, this.y - 1);
        if (this.moveable_y && particle_below.moveable_y && this.weight > particle_below.weight) {
            environment.swap(this.x, this.y, this.x, this.y - 1);
        }
    }

    compute_erosion(environment) {
        /**
         * Prevents single-cell hills from forming through artificial erosion
         */
        if (
            this.moveable_y && !this.passing_through &&
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
                let offset = FastRandom.choice(free_neighbours)
                if (offset != 0) {
                    environment.swap(this.x, this.y, this.x + offset, this.y);
                }
            }
        }
    }

    attempt_pass_through(check_x, check_y, environment) {

        if (this.pass_through_types.length == 0) {
            return;
        }

        // Particle can move in specified direction
        if (this.moveable && (this.moveable_x || this.x == check_x) && (this.moveable_y || this.y == check_y)) {
            // Check if this particle can pass through check_particle
            let check_particle = environment.get(check_x, check_y);

            // Particle can pass through check_particle or particle is already passing and is now in empty particle
            if (this.can_pass_through(check_x, check_y, environment) || (this.passing_through && check_particle.empty)) {

                environment.pass_through(this, check_x, check_y);
            }
            // Passing particle needs relocation to closest empty particle away from pass-through types
            else if (this.passing_through) {
                let [offset_x, offset_y] = [check_x - this.x, check_y - this.y]
                let neighbour = environment.get(this.x, this.y);
                let checking_neighbours = [neighbour];
                let neighbour_offsets = [[1,0],[-1,0],[0,-1],[0,1]];
                let i = 0;
                while (!neighbour.empty || this.check_pass_through_loop(neighbour.x, neighbour.y, offset_x, offset_y, environment)) {
                    for (let offset of neighbour_offsets) {
                        let new_neighbour = environment.get(neighbour.x + offset[0], neighbour.y + offset[1]);
                        if (new_neighbour.weight != 4 && !checking_neighbours.includes(new_neighbour)) {
                            checking_neighbours.push(new_neighbour);
                        }
                    }
                    neighbour = checking_neighbours[++i];
                }
                environment.pass_through(this, neighbour.x, neighbour.y);
            }
        }
    }

    // Checks if relocation to this position will cause an infinite pass-through relocation loop
    check_pass_through_loop(new_x, new_y, offset_x, offset_y, environment) {
        let [i, j] = [offset_x, offset_y]
        let check_particle = environment.get(new_x + i, new_y + j);
        while (check_particle.empty || check_particle.constructor.name == this.constructor.name) {
            [i, j] = [i + offset_x, j + offset_y];
            check_particle = environment.get(new_x + i, new_y + j);
        }
        return this.can_pass_through(new_x + i, new_y + j, environment)
    }

    // Can this particle pass through the particle type at coordinates new_x, new_y
    can_pass_through(new_x, new_y, environment) {
        let check_particle = environment.get(new_x, new_y);
        let pass_through = false;
        for (const valid_type of this.pass_through_types) {
            if (check_particle instanceof valid_type) {
                pass_through = true;
                break;
            }
        }
        return pass_through;
    }

    // Function to initalise random colour variation and update colour when needed
    get_color(s) {
        // If color is uninitialised, randomise it based on color_variance
        if (this.color === "#000000") {
            let c = s.color(this.base_color);
            let min = 1 - this.color_variance;
            let max = 1 + this.color_variance;
            this.brightness_offset = FastRandom.random() * (max - min) + min;
            this.saturation_offset = FastRandom.random() * (max - min) + min;

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
