import { Particle } from "./particles/particle";
import { Grid } from "./grid"

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;
        this.current_grid = new Grid(width, height, null)
        this.__next_grid = new Grid(width, height, null)
        this.organisms = [];
        this.light_level = 100;
        this.oxygen_level = 100;
        this.temperature_level = 100;
    }

    generate () {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (Math.random() < 0.1)
                    this.current_grid.set(x, y, new Particle())
            }
        }
    }

    update() {

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Particle(x,y) is Air
                if (this.current_grid.get(x,y) == null) {
                    // Set Particle(x,y) to Air
                    this.__next_grid.set(x,y,null)
                }
                // Particle(x,y) is not Air
                else {
                    // Particle(x,y) has gravity and Particle(x,y-1) is Air
                    if (this.current_grid.get(x,y).has_gravity && y > 0 && this.current_grid.get(x,y-1) == null) {
                        // Set Particle(x,y) to air
                        this.__next_grid.set(x,y,null)
                        // Set Particle(x,y-1) below to Particle(x,y)
                        this.__next_grid.set(x,y-1,this.current_grid.get(x,y))
                    }
                    // Keep Particle(x,y)
                    else {
                        this.__next_grid.set(x,y,this.current_grid.get(x,y))
                    }
                }
            }
        }

        const old_grid = this.current_grid
        this.current_grid = this.__next_grid
        this.__next_grid = old_grid
    }
}
