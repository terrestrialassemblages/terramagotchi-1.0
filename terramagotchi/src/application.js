import {
    BoundaryParticle,
    StoneParticle,
    SoilParticle,
    CompostParticle,
    WaterParticle,
    AirParticle,
} from "./particles";
import { Environment } from "./environment";
import { RenderQueue } from "./render_queue";
import { Bug } from "./organism"


// Global constants to limit particle processes
const THERMAL_TRANSFER_MINIMUM = 20; // minimum temperature for water/nutrient to transfer between soil particles

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;

        this.render_queue = new RenderQueue();
        this.environment = new Environment(width, height, this.render_queue);
    }

    generate() {
        /**
         * Populates the application environment with particles
         */
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (
                    x == 0 ||
                    y == 0 ||
                    x == this.width - 1 ||
                    y == this.height - 1
                ) {
                    this.environment.set(x, y, new BoundaryParticle());
                } else if (
                    y + Math.floor(10 * Math.sin(((x + 80) * Math.PI) / 300)) <
                    25
                ) {
                    this.environment.set(x, y, new StoneParticle());
                } else if (
                    y +
                        Math.floor(
                            50 * Math.sin(((x + 100) * Math.PI) / 200) +
                                4 * Math.sin((x+20) / 12)
                        ) <
                    85
                ) {
                    this.environment.set(x, y, new SoilParticle());
                } else if (y < 100) {
                    this.environment.set(x, y, new WaterParticle());
                } else if (y > 140 && Math.random() < 0.01) {
                    this.environment.set(x, y, new AirParticle());
                } else {
                    this.environment.set(x, y, new AirParticle());
                }
            }
        }
    }

    update() {
        /**
         * Handles the transition from the current environment state to the next.
         * Calls update function inside each particle to generate how they change
         * between environment states.
         * Then calls update function in organisms to check how they move.
         * (filter removes dead bugs from environment)
         * 
         * Bottom to Top, Left to right
         * Calls update function inside each particle to generate next environment state.
         */
        for (let x = 1; x < this.width - 1; x++) {
            for (let y = 1; y < this.height - 1; y++) {
                this.environment.get(x, y).update(x, y, this.environment)
            }
        }

        // Updates
        for (let bug of this.environment.organisms) {
            bug.update(this.environment)
        }
        this.environment.organisms = this.environment.organisms.filter(bug => bug.alive)

        /**
         * Bottom to Top, Random x order
         * Calls update function inside each particle to generate next environment state.
         
        let x_order = Array.from({length: this.width - 2}, (_, i) => i + 1)
        for (let i = x_order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [x_order[i], x_order[j]] = [x_order[j], x_order[i]];
        }

         for (let i = 0; i < x_order.length; i++) {
            let x = x_order[i]
            for (let y = 1; y < this.height - 1; y++) {
                this.environment.get(x, y).update(x, y, this.environment)
            }
        } */

        this.environment.increment_tick()
    }
}
