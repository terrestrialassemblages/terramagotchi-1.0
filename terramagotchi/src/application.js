import { Particle } from "./particles/particle";
import { Grid } from "./grid"

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;
        this.grid = new Grid(width, height, null)
        this.organisms = [];
        this.light_level = 100;
        this.oxygen_level = 100;
        this.temperature_level = 100;
    }

    generate () {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (y < this.height / 2)
                    this.grid.set(x, y, new Particle())
                if (Math.random() < 0.1)
                    this.grid.set(x, y, new Particle())
            }
        }
    }

    update() {

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Particle(x,y) is Air
                if (this.grid.get(x,y) == null) {
                    
                }
                // Particle(x,y) is not Air
                else {
                    // Particle(x,y) has gravity and Particle(x,y-1) is Air
                    if (this.grid.get(x,y).has_gravity && y > 0 && this.grid.get(x,y-1) == null) {
                        // Set Particle(x,y-1) below to Particle(x,y)
                        this.grid.set(x,y-1,this.grid.get(x,y))
                        // Set Particle(x,y) to air
                        this.grid.set(x,y,null)
                    }
                }
            }
        }
    }
}
