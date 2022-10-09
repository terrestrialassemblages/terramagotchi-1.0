import p5 from "p5";

import { Application } from "./application";

// Testing code: Imports for testing particles by manually adding
import {
    SoilParticle,
    StoneParticle,
    WaterParticle,
    SteamParticle,
    CompostParticle,
    DeadPlantParticle,
} from "./particles";

// cringe safety feature
p5.disableFriendlyErrors = true;

export const sketch = (s) => {
    /**
     * Function class for constructing a p5.js object
     */
    const application = new Application(270, 270);
    let cell_size = 3; // Defines cell size in pixels.
    let main, organisms;

    // The initial setup function.
    s.setup = () => {
        const canvas = s.createCanvas(
            application.width * cell_size,
            application.height * cell_size
        );
        canvas.canvas.style = ""; // Remove inline styling so that css works.

        main = s.createGraphics(s.width, s.height);
        organisms = s.createGraphics(s.width, s.height);
        main.noStroke();
        organisms.noStroke();
        s.colorMode(s.HSB);
        // s.frameRate(20);
        main.background("#87CEEB");
    };

    // The update function. Fires every frame
    s.draw = () => {
        application.update();
        // Iterates through all particles in the application's environment that
        // have changed and need to be rendered.
        for (let particle of application.environment.particle_grid) {
            if (particle.rerender) {
                particle.rerender = false;
                main.fill(particle.get_color(s));
                main.rect(
                    cell_size * particle.x,
                    cell_size * (application.height - 1 - particle.y),
                    cell_size,
                    cell_size
                );
            }
        }

        organisms.clear();
        for (let organism of application.environment.organisms) {
            for (let [prev_x, prev_y] of organism.location_history) {
                organisms.fill(organism.body_color);
                organisms.rect(
                    cell_size * prev_x,
                    cell_size * (application.height - 1 - prev_y),
                    cell_size,
                    cell_size
                );
            }

            organisms.fill(organism.head_color);
            organisms.rect(
                cell_size * organism.x,
                cell_size * (application.height - 1 - organism.y),
                cell_size,
                cell_size
            );

            if (organism.target_location !== null) {
                organisms.push();
                organisms.fill("#00FF0012");
                organisms.rect(
                    cell_size * organism.target_location[0],
                    cell_size *
                        (application.height - 1 - organism.target_location[1]),
                    cell_size,
                    cell_size
                );
                organisms.pop();
            }
        }

        s.image(main, 0, 0)
        s.image(organisms, 0, 0);
    };

    // Debug code for drawing
    let current_material = 1; // Default to stone
    let keys = {
        1: StoneParticle,
        2: SoilParticle,
        3: WaterParticle,
        4: SteamParticle,
        5: CompostParticle,
        6: DeadPlantParticle,
    };

    s.keyPressed = () => {
        if (s.key in keys) current_material = s.key;
    };

    s.mouseDragged = () => {
        const [x, y] = [
            Math.floor(s.mouseX / cell_size),
            application.height - 1 - Math.floor(s.mouseY / cell_size),
        ];
        application.environment.set(new keys[current_material](x, y));
    };
};

const sketchInstance = new p5(sketch);
