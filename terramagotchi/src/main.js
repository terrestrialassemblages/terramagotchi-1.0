import p5 from "p5";

import { Application } from "./application";
import { OrganicParticle, WaterParticle } from "./particles";

p5.disableFriendlyErrors = true;

export const sketch = (s) => {
    const application = new Application(500, 240);
    const bg_color = "#87CEEB";
    let cell_height, cell_width;

    let update_switch = false

    // The initial setup function.
    s.setup = () => {
        s.createCanvas(application.width * 3, application.height * 3);
        s.noStroke();
        s.colorMode(s.HSB);
        // s.frameRate(20)
        s.background(bg_color);
        application.generate();
        cell_height = s.height / application.height;
        cell_width = s.width / application.width;
    };

    // The update function. Fires every frame
    
    s.draw = () => {
        application.computer_interactions();
        application.gravity_update();
        application.update();
        // if (update_switch)
        //     application.computer_interactions();
        // else
        //     application.gravity_update();
        // update_switch = !update_switch

        while (application.render_queue.size() > 0) {
            const [x, y] = application.render_queue.pop();
            const particle = application.grid.get(x, y);
            s.fill(particle.get_color(s));

            s.rect(
                (s.width / application.width) * x,
                (s.height / application.height) * (application.height - 1 - y),
                cell_width,
                cell_height
            );
        }
    };

    // Debug code for drawing water
    s.mouseDragged = () => {
        const [x, y] = [Math.floor(s.mouseX/cell_width), application.height - 1 - Math.floor(s.mouseY/cell_height)];
        application.grid.set(x, y, new WaterParticle());
    }
};

const sketchInstance = new p5(sketch);
