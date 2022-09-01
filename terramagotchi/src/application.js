import { Particle, AirParticle } from "./particles";
import { Grid } from "./grid";

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;
        this.grid = new Grid(width, height, null);
        this.organisms = [];
        this.light_level = 100;
        this.oxygen_level = 100;
        this.temperature_level = 100;
    }

    generate() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (Math.random() < 0.1 || y < this.height / 2) {
                    this.grid.set(x, y, new Particle());
                } else {
                    this.grid.set(x, y, new AirParticle());
                }
            }
        }
    }

    update() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Particle(x,y) has gravity and Particle(x,y-1) is lighter
                if (
                    y > 0 &&
                    this.grid.get(x, y).has_gravity &&
                    this.grid.get(x, y).weight > this.grid.get(x, y - 1).weight
                ) {
                    // Set Particle(x,y-1) below to Particle(x,y)
                    const old_xy = this.grid.get(x, y);
                    this.grid.set(x, y, this.grid.get(x, y - 1));
                    this.grid.set(x, y - 1, old_xy);

                    this.grid.get(x, y).rerender = true;
                    this.grid.get(x, y - 1).rerender = true;
                }
            }
        }
    }
}
