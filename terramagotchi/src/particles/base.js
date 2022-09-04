export class BaseParticle {
    constructor() {
        this.base_color = "#000000";
        this.color_variance = 0.05;
        this.has_gravity = true;
        this.weight = 0;
        this.support = 4;
        this.color = this.base_color;
        this.brightness_offset = 0; // Purely for organic particles wetness visual currently
        this.update_color = false;
    }

    update(x, y, grid) {
        
    }

    // Function to initalise random colour variation and update colour when needed
    get_color(s) {
        // If color is uninitialised, randomise it based on color_variance
        if (this.color === "#000000") {
            let c = s.color(this.base_color);
            let min = 1 - this.color_variance;
            let max = 1 + this.color_variance;
            this.brightness_offset = Math.random() * (max - min) + min

            c = s.color(
                s.hue(c),
                s.saturation(c) * (Math.random() * (max - min) + min),
                s.brightness(c) * this.brightness_offset
            );
            this.color = c;
        }
        return this.color;
    }
}
