import p5 from "p5";

import { Application } from "./application";

// Testing code: Imports for testing particles by manually adding
import {
    SoilParticle,
    StoneParticle,
    WaterParticle,
    SteamParticle,
    CompostParticle,
} from "./particles";

// cringe safety feature
p5.disableFriendlyErrors = true;

export const sketch = (s) => {
    /**
     * Function class for constructing a p5.js object
     */
    const application = new Application(240, 240);
    let cell_size = 3; // Defines cell size in pixels.

    // The initial setup function.
    s.setup = () => {
        const canvas = s.createCanvas(
            application.width * cell_size,
            application.height * cell_size
        );
        canvas.canvas.style = ""; // Remove inline styling so that css works.
        s.noStroke();
        s.colorMode(s.HSB);
        s.frameRate(90);
        s.background("#87CEEB");
    };

    // The update function. Fires every frame
    s.draw = () => {
        application.update();

        // Iterates through all particles in the application's environment that
        // have changed and need to be rendered.
        for (let particle of application.environment.particle_grid) {
            if (particle.rerender) {
                particle.rerender = false;
                s.fill(particle.get_color(s));
                s.rect(
                    cell_size * particle.x,
                    cell_size * (application.height - 1 - particle.y),
                    cell_size,
                    cell_size
                );
            }
        }
    };

    // Debug code for drawing
    let current_material = 1; // Default to stone
    let keys = {
        1: StoneParticle,
        2: SoilParticle,
        3: WaterParticle,
        4: SteamParticle,
        5: CompostParticle,
    };

    s.keyPressed = () => {
        if (s.key in Object.keys(keys)) current_material = s.key;
    };

    s.mouseDragged = () => {
        const [x, y] = [
            Math.floor(s.mouseX / cell_size),
            application.height - 1 - Math.floor(s.mouseY / cell_size),
        ];
        application.environment.set(new keys[current_material](x, y));
        console.log(s.frameRate())
    };
};

const sketchInstance = new p5(sketch);
