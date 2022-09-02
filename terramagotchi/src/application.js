import {
    BoundaryParticle,
    StoneParticle,
    SoilParticle,
    WaterParticle,
    AirParticle,
} from "./particles";
import { ParticleGrid } from "./particle_grid";
import { RenderQueue } from "./render_queue";

export class Application {
    constructor(width = 400, height = 400) {
        // Stores a queue of displaced particle coordinates to re-render
        this.render_queue = new RenderQueue();

        this.width = width;
        this.height = height;
        this.grid = new ParticleGrid(width, height, this.render_queue);
        this.organisms = [];
        this.light_level = 100;
        this.oxygen_level = 100;
        this.temperature_level = 100;
    }

    generate() {
        // for (let y = 0; y < this.height; y++) {
        //     for (let x = 0; x < this.width; x++) {
        //         if (x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1) {
        //             this.grid.set(x, y, new BoundaryParticle());
        //         } else if (Math.random() < 0.01) {
        //             this.grid.set(x, y, new StoneParticle());
        //         }
        //     }
        // }
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
                    y + Math.floor(20 * Math.sin(((x - 50) * Math.PI) / 200)) <
                    85
                ) {
                    this.grid.set(x, y, new SoilParticle());
                } else if (y < 90) {
                    this.grid.set(x, y, new WaterParticle());
                } else if (y > 140 && Math.random() < 0.01) {
                    this.grid.set(x, y, new StoneParticle());
                } else {
                    this.grid.set(x, y, new AirParticle());
                }
            }
        }
    }

    gravity_update() {
        for (let x = 1; x < this.width - 1; x++) {
            let y = 0;
            while (++y < this.height - 2) {
                if (
                    this.grid.get(x, y).weight < this.grid.get(x, y + 1).weight &&
                    this.grid.get(x, y).has_gravity && this.grid.get(x, y + 1).has_gravity
                ) {
                    this.grid.swap(x, y, x, ++y);
                }
            }
        }
    }

    computer_interactions() {
        for (let x = 2; x < this.width - 2; x++) {}
    }
}
