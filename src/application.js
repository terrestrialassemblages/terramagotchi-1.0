import { Particle } from "./particles/particle";

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;
        this.current_grid = [];
        for (let y = 0; y < height; y++) {
            this.current_grid[y] = [];
            for (let x = 0; x < width; x++) {
                this.current_grid[y][x] = null;
            }
        }
        this.organisms = [];
        this.light_level = 100;
        this.oxygen_level = 100;
        this.temperature_level = 100;
    }
}