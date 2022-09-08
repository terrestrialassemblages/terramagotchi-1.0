import {
    BoundaryParticle,
    StoneParticle,
    SoilParticle,
    CompostParticle,
    WaterParticle,
    AirParticle,
} from "./particles";

export class Environment {
    constructor(width, height, render_queue) {
        this.__tick = 0;
        this.__particle_grid = new Array(width * height); // We store the particle grid as a 1D array for optimization.

        this.width = width;
        this.height = height;
        this.organisms = [];
        this.light_level = 100; // max 100
        this.oxygen_level = 100; // max 100
        this.temperature_level = 25; // max 100

        // Stored for internal uses only, if anything needs to access render_queue, they should do so via Application.
        this.__render_queue = render_queue;
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
                    this.set(x, y, new BoundaryParticle());
                } else if (
                    y + Math.floor(10 * Math.sin(((x + 80) * Math.PI) / 300)) <
                    25
                ) {
                    this.set(x, y, new StoneParticle());
                } else if (
                    y +
                        Math.floor(
                            50 * Math.sin(((x + 100) * Math.PI) / 200) +
                                4 * Math.sin((x + 20) / 12)
                        ) <
                    85
                ) {
                    this.set(x, y, new SoilParticle());
                } else if (y < 100) {
                    this.set(x, y, new WaterParticle());
                } else if (y > 140 && Math.random() < 0.01) {
                    this.set(x, y, new AirParticle());
                } else {
                    this.set(x, y, new AirParticle());
                }
            }
        }
    }

    // Using 1 arguement: Returns particle at grid index (i)
    // Using 2 arguements: Returns particle at grid position (x, y) as (i, j)
    // P.S. Feel free to change if you think this is a horrendous implementation!!!
    get(i, j) {
        if (arguments.length == 1) {
            return this.__particle_grid[i];
        }
        return this.__particle_grid[j * this.width + i];
    }

    set(x, y, value) {
        this.__particle_grid[y * this.width + x] = value;
        this.__render_queue.push(x, y);
    }

    swap(x1, y1, x2, y2) {
        const temp = this.__particle_grid[y1 * this.width + x1];
        this.__particle_grid[y1 * this.width + x1] =
            this.__particle_grid[y2 * this.width + x2];
        this.__particle_grid[y2 * this.width + x2] = temp;
        this.__render_queue.push(x1, y1);
        this.__render_queue.push(x2, y2);
    }

    get tick() {
        return this.__tick;
    }

    increment_tick() {
        this.__tick++;
    }
}
