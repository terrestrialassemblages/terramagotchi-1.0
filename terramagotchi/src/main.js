import p5 from "p5";

import { Application } from "./application";

export const sketch = (s) => {
    const application = new Application(50, 50);
    let cell_height, cell_width

    // The initial setup function.
    s.setup = () => {
        s.createCanvas(400, 400);
        s.noStroke();
        application.generate();
        cell_height = s.height / application.height
        cell_width = s.width / application.width
    };

    // The update function.
    s.draw = () => {
        s.background("#87CEEB");
        application.update();

        const grid = application.current_grid;

        for (let y = 0; y < application.height; y++) {
            for (let x = 0; x < application.width; x++) {
                // If the current position in the grid is null, then it is air and we skip it.
                if (grid.get(x, y) == null) continue;
                // Set the fill color to be that of the current particle.
                s.fill(grid.get(x, y).color);
                // We invert the y value by subtracting it from height, because p5 defaults to the top
                // left of the canvas being the origin point, while we want it to be the bottom left.
                s.rect(
                    s.width / application.width * x, 
                    s.height / application.height * (application.height - 1 - y), 
                    cell_width, 
                    cell_height
                );
            }
        }
    };
};

const sketchInstance = new p5(sketch);
