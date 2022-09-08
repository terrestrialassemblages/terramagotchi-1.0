export class Environment {
    constructor(width, height, render_queue) {
        this.__width = width
        this.__height = height
        this.__tick = 0

        // Stored for internal uses only, if anything needs to access render_queue, they should do so via Application.
        this.__render_queue = render_queue
        
        // Environment State
        this.__particle_grid = new Array(width * height) // We store the particle grid as a 1D array for optimization.
        this.organisms = [];
        this.light_level = 100;      // max 100
        this.oxygen_level = 100;     // max 100
        this.temperature_level = 25; // max 100
    }

    get width() {
        return this.__width
    }

    get height() {
        return this.__height
    }

    get(x, y) {
        return this.__particle_grid[y * this.__width + x]
    }

    set(x, y, value) {
        this.__particle_grid[y * this.__width + x] = value
        this.__render_queue.push(x, y)
    }

    swap(x1, y1, x2, y2) {
        const temp = this.__particle_grid[y1 * this.__width + x1]
        this.__particle_grid[y1 * this.__width + x1] = this.__particle_grid[y2 * this.__width + x2]
        this.__particle_grid[y2 * this.__width + x2] = temp
        this.__render_queue.push(x1, y1)
        this.__render_queue.push(x2, y2)
    }
    
    get tick() {
        return this.__tick
    }

    increment_tick() {
        this.__tick++
    }
}