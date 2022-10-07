import {
    AirParticle,
    BoundaryParticle,
    CompostParticle,
    DeadPlantParticle,
} from "./particles";

const ORGANISM_UPDATE_INTERVAL = 5;

export class Organism {
    alive = true;
    nutrient_capacity = 1000;
    water_capacity = 1000;
    nutrient_level = 100;
    water_level = 100;

    x = 120;
    y = 120;
    facing = [0, -1]; // Spawns facing downwards.
    location_history = [];
    target_location = null;
    reseek_timer = 0;
    current_objective = "CONSUME"; // Possible objectives are CONSUME, DEFECATE and WANDER
    update_timer = ORGANISM_UPDATE_INTERVAL;

    head_color = "#550000";
    body_color = "#bc4b52";

    constructor(environment) {
        // Ensure
        this.update_timer = (Math.random() * ORGANISM_UPDATE_INTERVAL) >> 0;
        this.seek(DeadPlantParticle, environment);
    }

    update(environment) {
        this.update_timer--;

        if (this.location_history.length > this.nutrient_level / 100)
            this.location_history.length = this.nutrient_level / 100;
        const fell = this.compute_gravity(environment);
        if (fell) return;

        if (this.update_timer <= 0) {
            this.update_timer = ORGANISM_UPDATE_INTERVAL;
            if (this.nutrient_level > 0 && this.water_level > 0) {
                if (this.reseek_timer <= 0) {
                    this.current_objective = "CONSUME";
                    this.seek(DeadPlantParticle, environment);
                }
                this.reseek_timer--;

                switch (this.current_objective) {
                    case "CONSUME":
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
                            if (environment.get(...this.target_location) instanceof DeadPlantParticle) {
                                this.move(environment);
                            } else {
                                this.seek(DeadPlantParticle, environment);
                                this.move(environment);
                            }
                        }
                        break;
                    case "DEFECATE":
                        if (
                            this.x == this.target_location[0] &&
                            this.y == this.target_location[1]
                        ) {
                            this.defecate(environment);
                        } else {
                            this.move(environment);
                        }
                        break;
                    case "WANDER":
                        this.move(environment);
                        break;
                }
            } else {
                this.alive = false;
            }
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
            this.facing = [0, -1];
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
        // Search in circles (really diamonds) based on the manhattan distance from itself.
        for (let depth = 1; depth <= MAX_DEPTH; depth++) {
            let y = 0;
            for (let x = depth; x >= -depth; x--) {
                y = Math.abs(x) - depth;
                if (
                    environment.get(this.x + x, this.y + y) instanceof looking_for &&
                    this.__is_location_accessible(this.x + x, this.y + y, environment)
                ) {
                    this.target_location = [this.x + x, this.y + y];
                    this.reseek_timer = 600;
                    return;
                }
            }
            for (let x = -(depth - 1); x <= depth - 1; x++) {
                y = depth - Math.abs(x);
                if (
                    environment.get(this.x + x, this.y + y) instanceof looking_for &&
                    this.__is_location_accessible(this.x + x, this.y + y, environment)
                ) {
                    this.target_location = [this.x + x, this.y + y];
                    this.reseek_timer = 600;
                    return;
                }
            }
        }

        this.current_objective = "WANDER";
        this.reseek_timer = 60;
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
            this.facing = [new_x - this.x, new_y - this.y];
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
        let best_neighbours = [];
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

            if (this.current_objective == "WANDER" && Math.random() < 0.8) {
                const neighbour_direction_x = neighbour[0] - this.x;
                const neighbour_direction_y = neighbour[1] - this.y;
                if (
                    neighbour_direction_x == this.facing[0] &&
                    neighbour_direction_y == this.facing[1]
                )
                    distance -= 2;
            }

            if (
                this.location_history.find(
                    ([previous_x, previous_y]) =>
                        previous_x == neighbour[0] && previous_y == neighbour[1]
                )
            ) {
                // Discourage the organism from walking on itself.
                distance += 10;
            }

            if (distance < best_distance) {
                best_neighbours = [neighbour];
                best_distance = distance;
            } else if (distance == best_distance) {
                best_neighbours.push(neighbour);
                best_distance = distance;
            }
        }
        return best_neighbours[(Math.random() * best_neighbours.length) >> 0];
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
