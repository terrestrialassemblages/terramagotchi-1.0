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
    nutrient_capacity = 1000;
    water_capacity = 1000;
    nutrient_level = 100;
    water_level = 100;

    x = 120;
    y = 120;
    location_history = [[120, 121]];
    target_location = null;
    target_location_reseek_timer = 1;
    current_objective = "CONSUME"; // Possible objectives are CONSUME, DEFECATE and WANDER

    head_color = "#550000";
    body_color = "#DD5500";

    constructor(environment) {
        this.seek(DeadPlantParticle, environment);
    }

    update(environment) {
        if (this.location_history.length - 1 > this.nutrient_level / 100)
            this.location_history.length = this.nutrient_level / 100;
        const fell = this.compute_gravity(environment);
        if (fell) return;

        if (this.nutrient_level > 0 && this.water_level > 0) {
            // if (this.nutrient_level == this.nutrient_capacity) {
            //     this.target_location === null
            //         ? this.move(environment)
            //         : this.defecate(environment);
            //     // BUG: This can cause the organism to end up stuck trying to poop but unable to move as move() is never called if we end up here.
            // } else if (
            //     this.target_location !== null &&
            //     this.x == this.target_location[0] &&
            //     this.y == this.target_location[1]
            // ) {
            //     this.consume(environment);

            //     if (this.nutrient_level == this.nutrient_capacity) {
            //         this.current_objective = "DEFECATE";
            //     } else {
            //         this.seek(DeadPlantParticle, environment);
            //     }
            // } else {
            //     this.move(environment);
            // }

            this.target_location_reseek_timer--;
            if (this.target_location_reseek_timer <= 0) {
                console.log("RESEEK");
                this.target_location_reseek_timer = 600;
                this.current_objective = "CONSUME";
                this.seek(DeadPlantParticle, environment);
            }

            switch (this.current_objective) {
                case "CONSUME":
                    console.log("consume");
                    if (
                        this.x == this.target_location[0] &&
                        this.y == this.target_location[1]
                    ) {
                        this.consume(environment);

                        if (this.nutrient_level == this.nutrient_capacity) {
                            this.current_objective = "DEFECATE";
                        } else {
                            this.seek(DeadPlantParticle, environment);
                        }
                    } else {
                        this.move(environment)
                    }
                    break;
                case "DEFECATE":
                    console.log("defecate");
                    if (
                        this.x == this.target_location[0] &&
                        this.y == this.target_location[1]
                    ) {
                        this.defecate(environment);
                    } else {
                        this.move(environment)
                    }
                    break;
                case "WANDER":
                    this.move(environment);
                    console.log("wander");
                    break;
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
            this.location_history.unshift([this.x, this.y]);

            this.y--;
            return true;
        }
        return false;
    }

    seek(looking_for, environment) {
        /*
            Seek for the next target location.
        */
        const MAX_DEPTH = 100;
        const facing_x = this.x - this.location_history[0][0];
        const facing_y = this.y - this.location_history[0][1];

        for (let depth = 0; depth <= MAX_DEPTH; depth++) {
            for (let pan = -depth * 2; pan <= depth * 2; pan++) {
                const check_location = [
                    this.x + facing_x * depth + facing_y * pan,
                    this.y + facing_y * depth + facing_x * pan,
                ];
                if (
                    environment.get(...check_location) instanceof looking_for &&
                    this.__is_location_accessible(
                        ...check_location,
                        environment
                    )
                ) {
                    this.target_location = check_location;
                    return;
                }
            }
        }

        this.current_objective = "WANDER";
        this.target_location = null;
    }

    move(environment) {
        /*
            Move towards the target location.
        */

        const valid_neighbours = this.__get_valid_neighbours(environment);

        if (valid_neighbours.length > 0) {
            this.location_history.unshift([this.x, this.y]);
            const [new_x, new_y] =
                this.__choose_best_neighbour(valid_neighbours);
            this.x = new_x;
            this.y = new_y;
        }
    }

    __is_location_accessible(x, y, environment) {
        if (
            x < 0 ||
            x > environment.width ||
            y < 0 ||
            y > environment.height ||
            environment.get(x, y) instanceof BoundaryParticle
        ) {
            return false;
        }

        for (let [neighbour_x, neighbour_y] of [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
            // These two neighbours are the bottom diagonal neighbours, allowing for the organism
            // to walk up a hill on only air.
            [1, -1],
            [-1, -1],
        ]) {
            // Find neighbours who are next to at least 1 particle which the organism can walk on.
            const neighbour_particle = environment.get(
                x + neighbour_x,
                y + neighbour_y
            );
            if (
                neighbour_particle.weight > 1 &&
                !(neighbour_particle instanceof BoundaryParticle)
            ) {
                return true;
            }
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
                this.__is_location_accessible(
                    this.x + neighbour_x,
                    this.y + neighbour_y,
                    environment
                )
            ) {
                valid_neighbours.push([
                    this.x + neighbour_x,
                    this.y + neighbour_y,
                ]);
            }
        }
        return valid_neighbours;
    }

    __choose_best_neighbour(valid_neighbours) {
        const current_distance =
            this.target_location === null
                ? 0
                : Math.abs(this.target_location[0] - this.x) +
                  Math.abs(this.target_location[1] - this.y);
        let best_neighbour;
        let best_distance = Infinity;
        for (let neighbour of valid_neighbours) {
            let distance =
                this.target_location === null
                    ? 0
                    : Math.abs(this.target_location[0] - neighbour[0]) +
                      Math.abs(this.target_location[1] - neighbour[1]);

            // Add some randomness to bug movement
            distance +=
                (Math.random() * (current_distance - distance + 2)) >> 0;

            if (
                this.location_history.find(
                    ([previous_x, previous_y]) =>
                        previous_x == neighbour[0] && previous_y == neighbour[1]
                )
            ) {
                // Discourage the organism from walking on itself.
                distance += 10;
            }

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
        const particle_below = environment.get(this.x, this.y);

        if (particle_below instanceof AirParticle) {
            const new_compost_particle = new CompostParticle(this.x, this.y);

            new_compost_particle.nutrient_content = this.nutrient_level - 100;
            this.nutrient_level = 100;

            environment.set(new_compost_particle);
            this.current_objective = "CONSUME";
            this.seek(DeadPlantParticle, environment);
        } else {
            this.seek(AirParticle, environment);
        }
    }
}
