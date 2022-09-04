import p5 from "p5";

import { Application } from "./application";
import { SoilParticle, StoneParticle, WaterParticle } from "./particles";

// cringe safety feature
p5.disableFriendlyErrors = true;

export const sketch = (s) => {
    /**
     * Function class for constructing a p5.js object
     */
    const application = new Application(240, 240);
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
            s.fill(particle.get_color(s));

            s.rect(
                (s.width / application.width) * x,
                (s.height / application.height) * (application.height - 1 - y),
                cell_size,
                cell_size
            );
        }
    };

    /** 
     * Debug code for drawing 
     * 1 = Stone
     * 2 = Soil
     * 3 = Water
     */ 
    let drawing = 49; // Default to drawing stone
    let keys = {}, p;
    keys[49] = StoneParticle;
    keys[50] = SoilParticle;
    keys[51] = WaterParticle;
    s.mouseDragged = () => {
        const [x, y] = [Math.floor(s.mouseX/cell_size), application.height - 1 - Math.floor(s.mouseY/cell_size)];
        application.grid.set(x, y, new keys[drawing]());
    }
    s.keyPressed = () => {
        drawing = s.keyCode;
    }
};

const sketchInstance = new p5(sketch);
