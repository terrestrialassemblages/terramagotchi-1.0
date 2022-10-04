import {
    AirParticle,
    BoundaryParticle,
    CompostParticle,
    DeadPlantParticle,
    OrganicParticle,
    WaterParticle,
} from "./particles";
import { LiquidParticle } from "./particles/liquid";

export class Organism {
    alive = true;
    nutrient_capacity = 300;
    water_capacity = 300;
    nutrient_level = 150;
    water_level = 50;

    x = 120;
    y = 120;
    location_history = [[120, 120]];
    target_location = [120, 120];

    head_color = "#550000";
    body_color = "#DD5500";

    constructor(environment) {
        this.seek(DeadPlantParticle, environment);
    }

    update(environment) {
        const fell = this.compute_gravity(environment);
        if (fell) return;

        if (this.nutrient_level > 0 && this.water_level > 0) {
            if (this.nutrient_level == this.nutrient_capacity) {
                this.defecate(environment);
            } else if (
                this.x == this.target_location[0] &&
                this.y == this.target_location[1]
            ) {
                this.consume(environment);
                this.seek(DeadPlantParticle, environment);
            } else {
                if (Math.random() < 0.3) this.move(environment);
            }
        } else {
            this.alive = false;
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
            return true;
        }
        return false;
    }

    temp_locations_list = [
        [200, 136],
        [175, 133],
        [125, 105],
    ];
    seek(look_for, environment) {
        /*
            Seek for the next target location.
        */
        this.target_location = this.temp_locations_list.pop();
        this.temp_locations_list.unshift(this.target_location);
    }

    move(environment) {
        /*
            Move towards the target location.
        */

        const valid_neighbours = this.__get_valid_neighbours(environment);

        if (valid_neighbours.length > 0) {
            this.location_history.push([this.x, this.y]);
            if (this.location_history.length > this.nutrient_level / 5)
                this.location_history.shift();
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
                [1, -1],
                [-1, -1],
            ]) {
                // Find neighbours who are next to at least 1 particle which the organism can walk on.
                const secondary_neighbour_particle = environment.get(
                    this.x + neighbour_x + secondary_neighbour_x,
                    this.y + neighbour_y + secondary_neighbour_y
                );
                if (
                    secondary_neighbour_particle.weight >= 1 &&
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

            // if (
            //     this.location_history.find(
            //         ([previous_x, previous_y]) =>
            //             previous_x == neighbour[0] && previous_y == neighbour[1]
            //     )
            // ) {
            //     distance += 4;
            // }

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

    consume(environment) {
        const particle = environment.get(this.x, this.y);

        if (particle instanceof DeadPlantParticle) {
            let transfer_amount = Math.min(
                particle.nutrient_level,
                this.nutrient_capacity - this.nutrient_level
            );
            this.nutrient_level += transfer_amount;
            particle.nutrient_level -= transfer_amount;

            if (particle.nutrient_level == 0) {
                let new_air_particle = new AirParticle(particle.x, particle.y);
                environment.set(new_air_particle);
            }
        }
    }

    defecate(environment) {
        const particle_below = environment.get(...this.location_history[0]);

        if (particle_below instanceof AirParticle) {
            const new_compost_particle = new CompostParticle(
                ...this.location_history[0]
            );

            new_compost_particle.nutrient_content = this.nutrient_level - 50;
            this.nutrient_level = 50;

            if (particle_below instanceof OrganicParticle) {
                new_compost_particle.nutrient_content +=
                    particle_below.nutrient_level;
            }

            environment.set(new_compost_particle);
            this.seek(DeadPlantParticle, environment);
        } else {
            this.seek(AirParticle, environment);
        }
    }
}
