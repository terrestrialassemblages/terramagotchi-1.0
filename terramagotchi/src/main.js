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
        application.update()

        for (let y = 0; y < application.height; y++) {
            for (let x = 0; x < application.width; x++) {
                const particle = application.grid.get(x, y);
                if (!particle.rerender) continue;
                particle.rerender = false;
                // Set the fill color to be that of the current particle.
                if (particle.weight === 0) {
                    s.fill(particle.color);
                } else {
                    random_color(s, particle.color)
                }
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

// Randomises saturation and brightness of a colour from x0.95 to x1.05
const random_color = (s, color) => {
    let c = s.color(color);
    s.colorMode(s.HSB);
    c = s.color(s.hue(c), s.saturation(c)*s.random(0.95,1.05), s.brightness(c)*s.random(0.95,1.05));
    s.fill(c);
}
