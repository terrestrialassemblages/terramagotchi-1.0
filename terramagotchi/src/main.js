import p5 from "p5"

import { Application } from "./application"

// Testing code: Imports for testing particles by manually adding
import {
    AirParticle,
    SoilParticle,
    StoneParticle,
    WaterParticle,
    SteamParticle,
    CompostParticle,
} from "./particles";
import { SeedParticle } from "./particles/plants";

// cringe safety feature
p5.disableFriendlyErrors = true

export const sketch = (s) => {
    /**
     * Function class for constructing a p5.js object
     */
    const application = new Application(180, 320)
    let cell_size = 3 // Defines cell size in pixels.

    let night_overlay_graphic, main_graphic;
    let sky_day_color, sky_night_color;

    let night_overlay_opacity;
    let smooth_darkness_intensity, darkness_banding, banded_darkness_intensity;

    // The initial setup function.
    s.setup = () => {
        const canvas = s.createCanvas(
            application.width * cell_size,
            application.height * cell_size
        );
        canvas.canvas.style = ""; // Remove inline styling so that css works.

        main_graphic = s.createGraphics(s.width, s.height);
        main_graphic.noStroke();

        night_overlay_graphic = s.createGraphics(s.width, s.height);

        sky_day_color = s.color(135,206,235);
        sky_night_color = s.color(0, 11, 31);
        night_overlay_opacity = 150;

        s.colorMode(s.HSB);
        // s.frameRate(20);
        s.background("#000")

        smooth_darkness_intensity = 0.9;
        darkness_banding = 5;
        banded_darkness_intensity = 0.7;
    }

    // The update function. Fires every frame
    s.draw = () => {
        application.update()

        // Iterates through all particles in the application's environment that
        // have changed and need to be rendered.
        for (let particle of application.environment.particle_grid) {
            if (particle.rerender) {
                // Particle is empty, erase paint in square of grid
                if (particle instanceof AirParticle) {
                    main_graphic.erase()
                }
                // Particle is not empty, paint over with full color
                else {
                    main_graphic.noErase()

                    particle.rerender = false

                    let particle_color = particle.get_color(s)

                    // Darken particle appropriately if under the horizon
                    if (particle.y < application.environment.get_horizon(particle.x)) {
                        let smooth_darkness_height = s.lerp(application.environment.get_horizon(particle.x), 150, 0.6) - 20;
                        let smooth_brightness = s.lerp(Math.min(1, (particle.y / smooth_darkness_height) + Math.random() * 0.05), 1, (1-smooth_darkness_intensity));

                        let banded_darkness_height = s.lerp(application.environment.get_horizon(particle.x), 150, 0.6) - 60;
                        let banded_brightness = ((s.lerp(Math.min(1, (particle.y / banded_darkness_height) + Math.random() * 0.02), 1, (1-banded_darkness_intensity)) 
                            * darkness_banding) | 0) / darkness_banding;

                        particle_color = s.color(
                            s.hue(particle_color),
                            s.saturation(particle_color),
                            s.brightness(particle_color) * s.lerp(banded_brightness, smooth_brightness, 0.85)
                        )
                    }

                    main_graphic.fill(particle_color);
                }

                // Paint square on grid
                main_graphic.rect(
                    cell_size * particle.x,
                    cell_size * (application.height - 1 - particle.y),
                    cell_size,
                    cell_size
                );
                particle.rerender = false;
            }
        }

        // Render background color
        s.background(s.lerpColor(sky_night_color, sky_day_color, application.environment.light_level / 100));
        // Render main environment grid
        s.image(main_graphic, 0, 0);

        // Render night-time darkening overlay
        night_overlay_graphic.clear();
        night_overlay_graphic.background(0, 0, 10, s.lerp(night_overlay_opacity, 0, application.environment.light_level / 100));
        s.image(night_overlay_graphic, 0, 0);
    };       

    // Debug code for drawing
    let current_material = 1 // Default to stone
    let keys = {
        1: StoneParticle,
        2: SoilParticle,
        3: WaterParticle,
        4: SteamParticle,
        5: CompostParticle,
        6: SeedParticle,
        7: SeedParticle,
    };

    s.keyPressed = () => {
        if (s.key in keys) current_material = s.key
    }

    s.mouseDragged = () => {
        const [x, y] = [Math.floor(s.mouseX / cell_size), application.height - 1 - Math.floor(s.mouseY / cell_size)]
        application.environment.set(new keys[current_material](x, y))
    }
}

const sketchInstance = new p5(sketch)
