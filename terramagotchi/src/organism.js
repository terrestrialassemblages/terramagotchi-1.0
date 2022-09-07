import { CompostParticle } from "./particles";

const MAX_WATER = 300;
const MAX_FOOD = 300;
const MAX_LENGTH = 300;


export class Bug {
    /**
     * Bug Class represents the organisms inhabiting the terrarium ecosystem.
     * Responsible for transporting and dispersing nutrients across the environment.
     * 
     * @param {int} x   Initial x-coordinate of bug
     * @param {int} y   Initial y-coordinate of bug
     */
    constructor(x = 120, y = 120) {
        this.x = x
        this.y = y
        this.head_color = "#000000"
        this.body_color = "#FF32FF"

        this.water_level = 20
        this.food_level = 200
        this.body_length = 1
        
        /** energy
        * arbitrarily from 0 to 100, dictates how often the bug will perform actions
        * more energy = higher frequency of actions */
        // this.energy = 10 // just an idea

        this.alive = true
    }

    update(grid) {
        let particle_below = grid.get(this.x, this.y-1)
        let particle_current = grid.get(this.x, this.y)

        // If the particle below is moveable and has a weight < 1 (e.g air, water, steam)
        // Then the bug performs the action of falling this frame
        if (particle_below.moveable && particle_below.weight < 1) {
            this.move(grid, 0, -1, false)
            return
        }

        // If the bug's position overlaps with a heavy particle, move it upwards
        else if (particle_current.weight >= 1) {
            if (this.y >= grid.get_height() - 2)
                this.die(grid)
            else
                this.move(grid, 0, 1, false)
            return;
        }

        // Now we handle the BUG ACTIONS; base on what it wants/doesn't want
        let action_probability = Math.min((this.water_level/MAX_WATER), (this.food_level/MAX_FOOD))

    }

    move(grid, dx, dy, consume_energy = true) {
        /** Move function used to handle any action where the bug decides to
         * move itself to a new location
         * @param {ParticleGrid} grid           The grid which the bug lives on
         * @param {int} dx                      x-displacement
         * @param {int} dy                      y-displacement
         * @param {boolean} consume_energy      Boolean for whether this movement was
         *                                      done by the bug itself using its own energy
         *                                      Or due to the environment (e.g., falling)
         */

        if (consume_energy) {
            this.water_level -= 1
            this.food_level -= 1
        }
        
        grid.queue_push(this.x, this.y)
        this.x += dx
        this.y += dy
    }

    die(grid, replace_with_compost = true) {
        // Function for when conditions are met such that the bug can no longer live
        // e.g., lack of food/water, lifespan reached, temperature too high, etc.


        this.alive = false
        if (replace_with_compost)
            grid.set(this.x, this.y, new CompostParticle()) // to be updated with CompostParticle
    }
}