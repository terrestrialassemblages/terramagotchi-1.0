import p5 from "p5";

import { Application } from "./application";

export const sketch = (s) => {
    const application = new Application(400, 400);

    // The initial setup function.
    s.setup = () => {
        s.createCanvas(400, 400);
        s.noStroke();
    };

    // The update function.
    s.draw = () => {
        s.background(255);
        application.update();

        const grid = application.current_grid;

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                // If the current position in the grid is null, then it is air and we skip it.
                if (grid[y][x] == null) continue;
                // Set the fill color to be that of the current particle.
                s.fill(grid[y][x].color);
                // We invert the y value by subtracting it from height, because p5 defaults to the top
                // left of the canvas being the origin point, while we want it to be the bottom left.
                s.rect(x, s.height - y, 1, 1);
            }
        }
    };
};

const sketchInstance = new p5(sketch);
