import p5 from "p5";

import { Application } from "./application";

p5.disableFriendlyErrors = true;

export const sketch = (s) => {
    const application = new Application(500, 240);
    const bg_color = "#87CEEB";
    let cell_height, cell_width;

    // The initial setup function.
    s.setup = () => {
        s.createCanvas(application.width * 3, application.height * 3);
        s.noStroke();
        s.colorMode(s.HSB);
        //s.frameRate(20)
        s.background(bg_color);
        application.generate();
        cell_height = s.height / application.height;
        cell_width = s.width / application.width;
    };

    // The update function. Fires every frame
    s.draw = () => {
        application.computer_interactions();
        application.gravity_update();

        while (application.render_queue.size() > 0) {
            const [x, y] = application.render_queue.pop();
            const particle = application.grid.get(x, y);
            random_color(particle.color, particle.color_variance);

            s.rect(
                (s.width / application.width) * x,
                (s.height / application.height) * (application.height - 1 - y),
                cell_width,
                cell_height
            );
        }
    };

    // Randomises saturation and brightness of a colour from 1-variance to 1+variance
    const random_color = (color, variance = 0.05) => {
        let c = s.color(color);
        let min = 1 - variance;
        let max = 1 + variance;
        c = s.color(
            s.hue(c),
            s.saturation(c) * (Math.random() * (max - min) + min),
            s.brightness(c) * (Math.random() * (max - min) + min)
        );
        s.fill(c);
    };
};

const sketchInstance = new p5(sketch);
