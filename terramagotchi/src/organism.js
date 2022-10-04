import { AirParticle, BoundaryParticle, WaterParticle } from "./particles";
import { LiquidParticle } from "./particles/liquid";

export class Organism {
    alive = true;
    nutrient_capacity = 300;
    water_capacity = 300;
    nutrient_level = 50;
    water_level = 50;

    x = 120;
    y = 120;
    target_location = [120, 120];

    color = "#FFF1BE";

    constructor() {
        this.seek();
    }

    update(environment) {
        this.compute_gravity(environment);

        // Check if the organism must die.
        this.alive = this.nutrient_level > 0 && this.water_level > 0; // NOTE: DOES THIS NEED TO BE A CLASS VAR??

        if (this.alive) {
            // NOTE: CONSIDER USING A TICK COUNTER INSTEAD OF RANDOM
            if (Math.random() < 0.1) this.move(environment);

            if (
                this.x == this.target_location[0] &&
                this.y == this.target_location[1]
            )
                this.seek(environment);
        }
    }

    compute_gravity(environment) {
        // Falls through particles with weight < 1, i.e. Air, Steam, Water.
        if (
            environment.get(this.x, this.y - 1).weight <= 1 &&
            environment.get(this.x - 1, this.y - 1).weight <= 1 && // This and the following check if there is support to the side
            environment.get(this.x + 1, this.y - 1).weight <= 1
        ) {
            this.location_history.push([this.x, this.y]);
            if (this.location_history.length > this.nutrient_level / 5)
                this.location_history.shift();

            this.y--;
        }
    }

    seek(environment) {
        /*
            Seek for the next target location.
        */
        this.target_location = [
            (this.x + Math.random() * 100 - 50) >> 0,
            (this.y + Math.random() * 100 - 50) >> 0,
        ];
    }

    move(environment) {
        /*
            Move towards the target location.
        */

        const valid_neighbours = this.__get_valid_neighbours(environment);

        if (valid_neighbours.length > 0) {
            environment.get(this.x, this.y).rerender = true;
            const [new_x, new_y] =
                this.__choose_best_neighbour(valid_neighbours);
            this.x = new_x;
            this.y = new_y;
        }
    }

    __get_valid_neighbours(environment) {
        let valid_neighbours = [];
        for (let [neighbour_x, neighbour_y] of [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ]) {
            if (
                environment.get(
                    this.x + neighbour_x,
                    this.y + neighbour_y
                ) instanceof BoundaryParticle
            ) {
                continue;
            }
            for (let [secondary_neighbour_x, secondary_neighbour_y] of [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ]) {
                // Find neighbours who are next to at least 1 particle which the organism can walk on.
                const secondary_neighbour_particle = environment.get(
                    this.x + neighbour_x + secondary_neighbour_x,
                    this.y + neighbour_y + secondary_neighbour_y
                );
                if (
                    secondary_neighbour_particle.weight > 1 &&
                    !(secondary_neighbour_particle instanceof BoundaryParticle)
                ) {
                    valid_neighbours.push([
                        this.x + neighbour_x,
                        this.y + neighbour_y,
                    ]);
                    break;
                }
            }
        }
        return valid_neighbours;
    }

    __choose_best_neighbour(valid_neighbours) {
        let best_neighbour = valid_neighbours[0];
        let best_distance =
            Math.abs(this.target_location[0] - best_neighbour[0]) +
            Math.abs(this.target_location[1] - best_neighbour[1]); // Manhattan distance
        for (let neighbour of valid_neighbours) {
            let distance =
                Math.abs(this.target_location[0] - neighbour[0]) +
                Math.abs(this.target_location[1] - neighbour[1]);
            if (
                distance < best_distance ||
                (distance == best_distance &&
                    Math.random() < 1 / valid_neighbours.length)
            ) {
                best_neighbour = neighbour;
                best_distance = distance;
            }
        }
        return best_neighbour;
    }

    consume(environment) {}

    defecate(environment) {}
}
