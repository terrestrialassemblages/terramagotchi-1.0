import p5 from "p5";

import { Application } from "./application";
import { OrganicParticle, WaterParticle } from "./particles";

// cringe safety feature
p5.disableFriendlyErrors = true;

export const sketch = (s) => {
    /**
     * Function class for constructing a p5.js object
     */
    const application = new Application(500, 240);
    const bg_color = "#87CEEB";
    let cell_size = 3; // Defines, in pixels, the size of each cell in our 2D grid on the canvas

    // The initial setup function.
    s.setup = () => {
        s.createCanvas(application.width * cell_size, application.height * cell_size);
        s.noStroke();
        s.colorMode(s.HSB);
        // s.frameRate(20)
        s.background(bg_color);
        application.generate();
    };

    // The update function. Fires every frame
    
    s.draw = () => {
        application.update();

        while (application.render_queue.size() > 0) {
            const [x, y] = application.render_queue.pop();
            const particle = application.grid.get(x, y);
            random_color(particle);

            s.rect(
                (s.width / application.width) * x,
                (s.height / application.height) * (application.height - 1 - y),
                cell_size,
                cell_size
            );
        }
    };

    const random_color = (particle) => {
        /** Randomises saturation and brightness of a particle from 1-variance to 1+variance */
        let c = s.color(particle.color);
        let min = 1 - particle.color_variance;
        let max = 1 + particle.color_variance;
        // Makes brightness darker if water_level is higher
        let brightness = particle instanceof OrganicParticle ? 
            s.brightness(c) * (Math.random() * (max - min) + min) - particle.water_level / 8 :
            s.brightness(c) * (Math.random() * (max - min) + min);

        c = s.color(
            s.hue(c),
            s.saturation(c) * (Math.random() * (max - min) + min),
            brightness
        );
        s.fill(c);
    };

    // Debug code for drawing water
    s.mouseDragged = () => {
        const [x, y] = [Math.floor(s.mouseX/cell_size), application.height - 1 - Math.floor(s.mouseY/cell_size)];
        application.grid.set(x, y, new WaterParticle());
    }
};

const sketchInstance = new p5(sketch);
