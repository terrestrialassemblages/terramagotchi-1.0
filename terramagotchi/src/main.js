import p5 from "p5";
import { Application } from "./application";
import cryptoRandomString from "crypto-random-string";
import { toCanvas as generate_QR } from "qrcode";
import { FastRandom } from "./fast-random";

// Testing code: Imports for testing particles by manually adding
import {
    AirParticle,
    SoilParticle,
    StoneParticle,
    WaterParticle,
    SteamParticle,
    CompostParticle,
    OrganicParticle,
} from "./particles";

import { SeedParticle, DeadPlantParticle, PlantFamilyParticle, RootParticle, LeafParticle } from "./particles/plants";

/**
 * Firebase Config, This is specific to the Terramagotchi Firebase project
 * To use a different firebase project you will need to use a new config found in project settings
 */
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAR_EPf5oGeR6l0OhcUn6VUkwOcJCh2xjc",
    authDomain: "terramagotchi.firebaseapp.com",
    projectId: "terramagotchi",
    storageBucket: "terramagotchi.appspot.com",
    messagingSenderId: "983152859921",
    appId: "1:983152859921:web:0cfd2e706ed003c6484ab0"
};

// Check if URL param for id exists, if it does set the instance id to it
const id_param = (new URL(document.location)).searchParams.get("id");
const INSTANCE_ID = id_param ? id_param : "main"; // Constant instance id for debug
//const INSTANCE_ID = id_param ? id_param : cryptoRandomString({ length: 6, type: "alphanumeric" });

let show_qr = false;

// cringe safety feature
p5.disableFriendlyErrors = true

export const sketch = (s) => {
    /**
     * Function class for constructing a p5.js object
     */
    const application = new Application(180, 320, INSTANCE_ID, FIREBASE_CONFIG);
    let cell_size = 6; // Defines cell size in pixels.

    let night_overlay_graphic, main_graphic, organisms_graphic, deep_dark_overlay_graphic;
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

        organisms_graphic = s.createGraphics(s.width, s.height);
        organisms_graphic.noStroke();

        night_overlay_graphic = s.createGraphics(s.width, s.height);

        sky_day_color = s.color(135,206,235);
        sky_night_color = s.color(0, 11, 31);
        night_overlay_opacity = 150;

        s.colorMode(s.HSB);
        // s.frameRate(20);
        s.background("#000000");

        canvas.mouseClicked(() => {
            let x_pos = s.mouseX / cell_size | 0
            let y_pos = (application.height - (s.mouseY / cell_size)) | 0
            let target_particle = application.environment.get(x_pos, y_pos)
            
            console.log(target_particle.constructor.name, "| moveable: " + target_particle.moveable, "| weight: " + target_particle.weight)
            if (target_particle instanceof OrganicParticle) {
                console.log("Water/Nutrient capacitys: ", target_particle.water_capacity, target_particle.nutrient_capacity)
                console.log("Water/Nutrient levels: ", target_particle.water_level, target_particle.nutrient_level)
                console.log("This location: ", [target_particle.x, target_particle.y])
            }
            if (target_particle instanceof PlantFamilyParticle) {
                console.log("Energy: " + target_particle.energy + " / " + target_particle.energy_capacity)
                console.log("is dead:", target_particle.dead)
            }
            if (target_particle instanceof RootParticle) {
                console.log("Is node: " + target_particle.is_node)
                console.log("Is active: " + target_particle.is_active)
                console.log("Parent location: " + target_particle.parent_root_particle)
            }
            if (target_particle instanceof LeafParticle) {
                console.log("Is root: " + target_particle.is_leaf_root)
                console.log("Is active: " + target_particle.is_active)
            }
            console.log("")
        })

        deep_dark_overlay_graphic = s.createGraphics(s.width, s.height);
        deep_dark_overlay_graphic.noStroke();

        smooth_darkness_intensity = 0.9;
        darkness_banding = 5;
        banded_darkness_intensity = 0.7;

        s.paint_deep_dark_overlay()
    }

    s.paint_deep_dark_overlay = () => {
        // Iterates through all particles in the application's environment to
        // draw the deep dark overlay
        for (let particle of application.environment.particle_grid) {
            // Darken cell of grid if it is below the terrain horizon
            if (particle.y < application.environment.get_horizon(particle.x)) {
                let smooth_darkness_height = s.lerp(application.environment.get_horizon(particle.x), 150, 0.6) - 20;
                let smooth_brightness = s.lerp(Math.min(1, (particle.y / smooth_darkness_height) + FastRandom.random() * 0.05), 1, (1-smooth_darkness_intensity));

                let banded_darkness_height = s.lerp(application.environment.get_horizon(particle.x), 150, 0.6) - 60;
                let banded_brightness = ((s.lerp(Math.min(1, (particle.y / banded_darkness_height) + FastRandom.random() * 0.02), 1, (1-banded_darkness_intensity)) 
                    * darkness_banding) | 0) / darkness_banding;

                // Set the fill colour to black with the appropriate opacity 
                deep_dark_overlay_graphic.fill(0, (1 - s.lerp(banded_brightness, smooth_brightness, 0.85)) * 255)

                // Paint square on grid
                deep_dark_overlay_graphic.rect(
                    cell_size * particle.x,
                    cell_size * (application.height - 1 - particle.y),
                    cell_size,
                    cell_size
                );
            }
        }
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
                    main_graphic.fill(particle.get_color(s));
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

        // Render organisms
        organisms_graphic.clear();
        for (let organism of application.environment.organisms) {
            for (let i = 0; i < organism.location_history.length; i++) {
                const [prev_x, prev_y] = organism.location_history[i]
                const color = organism.body_colors[i]
                organisms_graphic.fill(color);
                organisms_graphic.rect(
                    cell_size * prev_x,
                    cell_size * (application.height - 1 - prev_y),
                    cell_size,
                    cell_size
                );
            }

            organisms_graphic.fill(organism.head_color);
            organisms_graphic.rect(
                cell_size * organism.x,
                cell_size * (application.height - 1 - organism.y),
                cell_size,
                cell_size
            );
        }

        // Render background color
        s.background(s.lerpColor(sky_night_color, sky_day_color, application.environment.light_level / 100));
        // Render main environment grid
        s.image(main_graphic, 0, 0);
        // Display organisms
        s.image(organisms_graphic, 0, 0);

        // Display deep dark overlay
        s.image(deep_dark_overlay_graphic, 0, 0);

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
        7: DeadPlantParticle,
    };

    s.keyPressed = () => {
        if (s.key in keys) {
            current_material = s.key;
        } else if (s.key == 'o') {
            const [x, y] = [
                Math.floor(s.mouseX / cell_size),
                application.height - 1 - Math.floor(s.mouseY / cell_size),
            ];
            application.environment.spawn_organism(x, y)
        }
    }

    s.mouseDragged = () => {
        const [x, y] = [Math.floor(s.mouseX / cell_size), application.height - 1 - Math.floor(s.mouseY / cell_size)]
        application.environment.set(new keys[current_material](x, y))
    }
}

const sketchInstance = new p5(sketch);

// Generate QR Code for the remote app
const qr_code_canvas = document.getElementById("qr-code");
const remote_url = document.location.host + "/remote/?id=" + INSTANCE_ID;
generate_QR(qr_code_canvas, remote_url, { width: 400, height: 400 });
document.getElementById("remote-url").innerText = remote_url;

// If . is pressed, toggle QR code visibility
document.addEventListener("keyup", (e) => {
    if (e.key === ".") {
        if (show_qr) {
            sketchInstance.loop();
            document.querySelector("main").style.display = "flex";
            document.getElementById("qr-container").style.display = "none";
            show_qr = false;
        } else {
            sketchInstance.noLoop();
            document.querySelector("main").style.display = "none";
            document.getElementById("qr-container").style.display = "flex";
            show_qr = true;
        }
    }
});