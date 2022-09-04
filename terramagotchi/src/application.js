import {
    BoundaryParticle,
    StoneParticle,
    SoilParticle,
    WaterParticle,
    AirParticle,
} from "./particles";
import { ParticleGrid } from "./particle_grid";
import { RenderQueue } from "./render_queue";


// Global constants to limit particle processes
const THERMAL_TRANSFER_MINIMUM = 20; // minimum temperature for water/nutrient to transfer between soil particles

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;

        this.render_queue = new RenderQueue();
        this.grid = new ParticleGrid(width, height, this.render_queue);
        this.organisms = [];

        // Environment variables
        this.light_level = 100;
        this.oxygen_level = 100;
        this.temperature_level = 25; // max 100
    }

    generate() {
        /**
         * Populates the application grid with particles
         */
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (
                    x == 0 ||
                    y == 0 ||
                    x == this.width - 1 ||
                    y == this.height - 1
                ) {
                    this.grid.set(x, y, new BoundaryParticle());
                } else if (
                    y + Math.floor(10 * Math.sin(((x + 80) * Math.PI) / 300)) <
                    25
                ) {
                    this.grid.set(x, y, new StoneParticle());
                } else if (
                    y +
                        Math.floor(
                            50 * Math.sin(((x + 100) * Math.PI) / 200) +
                                4 * Math.sin((x+20) / 12)
                        ) <
                    85
                ) {
                    this.grid.set(x, y, new SoilParticle());
                } else if (y < 100) {
                    this.grid.set(x, y, new WaterParticle());
                } else if (y > 140 && Math.random() < 0.01) {
                    this.grid.set(x, y, new AirParticle());
                } else {
                    this.grid.set(x, y, new AirParticle());
                }
            }
        }
    }

    update() {
        /**
         * Calls update function inside each particle to generate next grid state.
         */
        for (let x = 1; x < this.width - 1; x++) {
            for (let y = 1; y < this.height - 1; y++) {
                this.grid.get(x, y).update(x, y, this.grid)
            }
        }
    }
}
