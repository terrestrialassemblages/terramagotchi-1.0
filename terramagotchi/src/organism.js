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

    color = "#FFF1BE";

    update(environment) {
        this.compute_gravity(environment);

        // Check if the organism must die.
        this.alive = this.nutrient_level > 0 && this.water_level > 0; // NOTE: DOES THIS NEED TO BE A CLASS VAR??

        if (this.alive && Math.random() < 0.1)
            // NOTE: CONSIDER USING A TICK COUNTER INSTEAD OF RANDOM
            this.move(environment);
    }

    compute_gravity(environment) {
        // Falls through particles with weight <= 1, i.e. Air, Steam and Water.
        if (environment.get(this.x, this.y - 1).weight <= 1) {
            environment.get(this.x, this.y).rerender = true;
            this.y--;
        }
    }

    move(environment) {
        /*
            Performs a random walk.
            TODO: Implement pathfinding towards water / deadplants.
        */

        const valid_neighbours = [];
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
                    valid_neighbours.push([neighbour_x, neighbour_y]);
                    break;
                }
            }
        }

        if (valid_neighbours.length > 0) {
            const [move_x, move_y] =
                valid_neighbours[
                    (Math.random() * valid_neighbours.length) >> 0
                ];
            this.x += move_x;
            this.y += move_y;
        }
    }

    consume(environment) {}

    defecate(environment) {}
}
