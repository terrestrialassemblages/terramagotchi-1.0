import { FastRandom } from "./fast-random"
import { AirParticle, BoundaryParticle, CompostParticle, SoilParticle } from "./particles"
import { DeadPlantParticle } from "./particles/plants"

// The organism will only update every ORGANISM_UPDATE_INTERVAL frames. This does thus affect movement speed.
const ORGANISM_UPDATE_INTERVAL = 15

// The organisms body is at least this long.
const MIN_LENGTH = 5

// The organism may move onto any of these particle types.
const CAN_TRAVERSE = [AirParticle, SoilParticle, DeadPlantParticle, CompostParticle]

// The organism will seek in a radial diamond with a radius of MAX_SEEK_DEPTH.
const MAX_SEEK_DEPTH = 100

// The base nutrient and water levels which an organism spawns with and which it keeps after defecating.
const MIN_NUTRIENTS = 100
const MIN_WATER = 100

// The ratio for how much energy 1 nutrient/water is worth.
const ENERGY_RATIO = 10

// This will cause it to sleep for (30 + update_timer) frames
const FALL_ASLEEP_WANDERING_CHANCE = 0.5 // [0, 1]

// Integer value. At about 4 it will generally result in just a random walk.
// Does not affect wandering, use CHANGE_WANDER_DIRECTION_CHANCE.
const RANDOM_MOVEMENT_FACTOR = 2
const CHANGE_WANDER_DIRECTION_CHANCE = 0.2 // [0, 1]

// The organism will sleep for (RESEEK_TIME_AFTER_CONSUME + update_timer) frames before reseeking.
const RESEEK_TIME_AFTER_CONSUME = 30

// The organism will reseek (RESEEK_TIMER_AFTER_FOUND_NEW_TARGET + update_timer) frames
// after successfully finding a target. This prevents it from trying to get to a dead plant
// which it can't reach when there may be new dead plants it can consume instead.
const RESEEK_TIMER_AFTER_FOUND_NEW_TARGET = 600

// The organism will reseek (RESEEK_TIMER_AFTER_FAILED_TO_FIND_NEW_TARGET + update_timer)
// frames after it failed to find dead plants during a seek.
const RESEEK_TIMER_AFTER_FAILED_TO_FIND_NEW_TARGET = 60

export class Organism {
    nutrient_capacity = 1000
    water_capacity = 1000
    nutrient_level = MIN_NUTRIENTS
    water_level = MIN_WATER
    energy = 200

    x = 120
    y = 120
    facing = [0, -1] // Spawns facing downwards.
    location_history = []
    target_location = null
    current_objective = "CONSUME" // Possible objectives are CONSUME, DEFECATE, WANDER and SLEEP
    reseek_timer = 0
    update_timer = 0

    head_color = "#550000"
    body_color = "#bc4b52"

    constructor(x, y, environment) {
        this.x = x
        this.y = y
        this.update_timer = (Math.random() * ORGANISM_UPDATE_INTERVAL) >> 0
        this.seek(DeadPlantParticle, environment)
    }

    update(environment) {
        /**
         * The main function which directs the organism's state and behaviour.
         */

        if (this.location_history.length > this.nutrient_level / 100 + MIN_LENGTH)
            this.location_history.length = (this.nutrient_level / 100 + MIN_LENGTH) >> 0

        const fell = this.compute_gravity(environment)
        if (fell) return

        this.update_timer--
        this.reseek_timer--

        if (this.update_timer > 0) return
        this.update_timer = ORGANISM_UPDATE_INTERVAL

        if (this.nutrient_level > 0 && this.water_level > 0) {
            this.advance_object(environment)
        } else {
            this.die(environment)
        }

        this.energy--
    }

    compute_gravity(environment) {
        /**
         * Computes gravity on the head of the organism.
         * If the row of pixels 3 wide below of the organism's head are not supportive, the organism will fall.
         */
        // Falls through particles with weight < 1, i.e. Air, Steam, Water.
        if (
            environment.get(this.x, this.y - 1).weight <= 1 &&
            environment.get(this.x - 1, this.y - 1).weight <= 1 && // This and the following check if there is support to the side
            environment.get(this.x + 1, this.y - 1).weight <= 1
        ) {
            this.location_history.unshift([this.x, this.y])
            this.facing = [0, -1]
            this.y--
            return true
        }
        return false
    }

    advance_object(environment) {
        /**
         * Perform actions according to the current objective, in effort to complete it.
         */

        if (this.reseek_timer <= 0) {
            this.evaluate_objective(environment)
        }

        switch (this.current_objective) {
            case "CONSUME":
                if (this.x == this.target_location[0] && this.y == this.target_location[1]) {
                    this.consume(environment)
                    this.evaluate_objective(environment)
                } else {
                    if (!(environment.get(...this.target_location) instanceof DeadPlantParticle))
                        this.seek(DeadPlantParticle, environment)
                    this.move(environment)
                }
                break
            case "DEFECATE":
                if (this.x == this.target_location[0] && this.y == this.target_location[1]) {
                    this.defecate(environment)
                    this.evaluate_objective(environment)
                } else {
                    if (!(environment.get(...this.target_location) instanceof AirParticle))
                        this.seek(AirParticle, environment)
                    this.move(environment)
                }
                break
            case "WANDER":
                this.move(environment)
                break
            case "SLEEP":
                // They are asleep. They do nothing else.
                break
        }
    }

    evaluate_objective(environment) {
        /**
         * Decide what the organism's current objective should be.
         */

        if (this.nutrient_level < this.nutrient_capacity) {
            if (this.current_objective == "CONSUME") {
                this.current_objective = "SLEEP"
                this.reseek_timer = RESEEK_TIME_AFTER_CONSUME
            } else {
                this.current_objective = "CONSUME"
                this.seek(DeadPlantParticle, environment)
            }
        } else if (this.nutrient_level == this.nutrient_capacity) {
            this.current_objective = "DEFECATE"
            this.seek(AirParticle, environment)
        } else {
            this.current_objective = "WANDER"
            this.target_location = null
        }
    }

    seek(looking_for, environment) {
        /**
         * Seek for the next target location based on the manhattan distance from the organism.
         * Where `depth` is the manhattan distance.
         * At each depth, it searches in a circular order, starting on the right of itself.
         */

        let y = 0
        for (let depth = 1; depth <= MAX_SEEK_DEPTH; depth++) {
            for (let x = depth; x >= -depth; x--) {
                y = Math.abs(x) - depth
                if (
                    environment.get(this.x + x, this.y + y) instanceof looking_for &&
                    this.__is_location_accessible(this.x + x, this.y + y, environment)
                ) {
                    this.target_location = [this.x + x, this.y + y]
                    this.reseek_timer = RESEEK_TIMER_AFTER_FOUND_NEW_TARGET
                    return
                }
            }
            for (let x = -(depth - 1); x <= depth - 1; x++) {
                y = depth - Math.abs(x)
                if (
                    environment.get(this.x + x, this.y + y) instanceof looking_for &&
                    this.__is_location_accessible(this.x + x, this.y + y, environment)
                ) {
                    this.target_location = [this.x + x, this.y + y]
                    this.reseek_timer = RESEEK_TIMER_AFTER_FOUND_NEW_TARGET
                    return
                }
            }
        }

        if (Math.random() < FALL_ASLEEP_WANDERING_CHANCE) {
            this.current_objective = "SLEEP"
        } else {
            this.current_objective = "WANDER"
        }

        this.reseek_timer = RESEEK_TIMER_AFTER_FAILED_TO_FIND_NEW_TARGET
        this.target_location = null
    }

    move(environment) {
        /*
            Move towards the target location.
        */

        const valid_neighbours = this.__get_valid_neighbours(environment)

        if (valid_neighbours.length > 0) {
            this.location_history.unshift([this.x, this.y])
            const [new_x, new_y] = this.__choose_best_neighbour(valid_neighbours)
            this.facing = [new_x - this.x, new_y - this.y]
            this.x = new_x
            this.y = new_y
        }
    }

    __can_traverse(x, y, environment) {
        /**
         * Checks that the given location is a particle type on which the organism can traverse.
         */

        for (let type of CAN_TRAVERSE) if (environment.get(x, y) instanceof type) return true
    }

    __is_location_accessible(x, y, environment) {
        /**
         * Checks that the given location is within bounds, is traversible, and has at least one
         * traversible neighbour.
         */

        if (
            x < 1 ||
            x > environment.width - 1 ||
            y < 1 ||
            y > environment.height - 1 ||
            !this.__can_traverse(x, y, environment)
        ) {
            return false
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
            if (
                this.__can_traverse(x + neighbour_x, y + neighbour_y, environment) &&
                !(environment.get(x + neighbour_x, y + neighbour_y) instanceof AirParticle)
            ) {
                return true
            }
        }
    }

    __get_valid_neighbours(environment) {
        /**
         * Checks the four neighbouring particles and returns which ones are accessible.
         */

        let valid_neighbours = []
        for (let [move_x, move_y] of [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ]) {
            if (this.__is_location_accessible(this.x + move_x, this.y + move_y, environment)) {
                valid_neighbours.push([this.x + move_x, this.y + move_y])
            }
        }

        return valid_neighbours
    }

    __choose_best_neighbour(valid_neighbours) {
        /**
         * Calculates the best neighbour based on its distance from the target location.
         * If there is no target location, it performs a random walk, with a preference to
         * walk in the same direction.
         */

        const current_distance =
            this.target_location === null
                ? 0
                : Math.abs(this.target_location[0] - this.x) + Math.abs(this.target_location[1] - this.y)

        let best_neighbours = []
        let best_distance = Infinity
        for (let neighbour of valid_neighbours) {
            let distance =
                this.target_location === null
                    ? 0
                    : Math.abs(this.target_location[0] - neighbour[0]) +
                      Math.abs(this.target_location[1] - neighbour[1])

            // Add some randomness to bug movement
            distance += (Math.random() * (current_distance - distance + RANDOM_MOVEMENT_FACTOR)) >> 0

            if (this.current_objective == "WANDER" && Math.random() < 1 - CHANGE_WANDER_DIRECTION_CHANCE) {
                const neighbour_direction_x = neighbour[0] - this.x
                const neighbour_direction_y = neighbour[1] - this.y
                if (neighbour_direction_x == this.facing[0] && neighbour_direction_y == this.facing[1]) distance -= 2
            }

            // Discourage the organism from walking on itself.
            distance += this.location_history.filter(
                ([previous_x, previous_y]) => previous_x == neighbour[0] && previous_y == neighbour[1]
            ).length

            if (distance < best_distance) {
                best_neighbours = [neighbour]
                best_distance = distance
            } else if (distance == best_distance) {
                best_neighbours.push(neighbour)
                best_distance = distance
            }
        }

        return best_neighbours[(Math.random() * best_neighbours.length) >> 0]
    }

    consume(environment) {
        /**
         * Handles transferring nutrients/water from a particle to the organism.
         */

        const particle = environment.get(this.x, this.y)

        // Consume nutrients from the DeadPlantParticle
        let transfer_nutrients_amount = Math.min(particle.nutrient_level, this.nutrient_capacity - this.nutrient_level)
        this.nutrient_level += transfer_nutrients_amount
        particle.nutrient_level -= transfer_nutrients_amount

        // Consume water from the DeadPlantParticle
        let transfer_water_amount = Math.min(particle.water_level, this.water_capacity - this.water_level)
        this.water_level += transfer_water_amount
        particle.water_level -= transfer_water_amount

        // Increase energy based on what was consumed.
        this.energy += ENERGY_RATIO * (transfer_nutrients_amount + transfer_water_amount)

        // If the DeadPlantParticle now has no water nor nutrients left, replace it with AirParticle.
        if (particle.nutrient_level == 0 && particle.water_level == 0) {
            let new_air_particle = new AirParticle(particle.x, particle.y)
            environment.set(new_air_particle)
        }
    }

    defecate(environment) {
        /**
         * Handles producing a compost particle and donating nutrients/water to said particle.
         */

        const new_compost_particle = new CompostParticle(this.x, this.y)
        // new_compost_particle.decay_into = environment.get(this.x, this.y)

        new_compost_particle.nutrient_content = this.nutrient_level - MIN_NUTRIENTS
        this.nutrient_level = MIN_NUTRIENTS
        new_compost_particle.water_content = this.water_level - MIN_WATER
        this.water_level = MIN_WATER

        environment.set(new_compost_particle)
    }

    die(environment) {
        /**
         * Handles when the organism dies and turns to compost.
         */

        for (let [x, y] of this.location_history) {
            let new_compost_particle = new CompostParticle(x, y)
            new_compost_particle.nutrient_content = Math.round(this.nutrient_level / this.location_history.length)
            new_compost_particle.water_content = Math.round(this.water_level / this.location_history.length)

            if (environment.get(x, y) instanceof SoilParticle) new_compost_particle.decay_into = SoilParticle

            environment.set(new_compost_particle)
        }
        // Remove the organism from the Environment.
        environment.organisms.splice(environment.organisms.indexOf(this), 1)
    }
}
