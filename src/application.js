import { Particle } from "./particles/particle";
import { Grid } from "./grid"

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;
        this.current_grid = new Grid(width, height, null)
        this.next_grid = new Grid(width, height, null)
        this.organisms = [];
        this.light_level = 100;
        this.oxygen_level = 100;
        this.temperature_level = 100;
    }

    generate () {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (Math.random() < 0.5)
                    this.current_grid.set(x, y, new Particle())
            }
        }
    }

    update() {}
}
