
export class ParticleGrid {
    constructor(width, height, render_queue) {
        this.__width = width
        this.__height = height
        this.__list = new Array(width * height)
        this.__render_queue = render_queue
        this.__frame = 0
    }

    get(x, y) {
        return this.__list[y * this.__width + x]
    }

    set(x, y, value) {
        this.__list[y * this.__width + x] = value
        this.__render_queue.push(x, y)
    }

    swap(x1, y1, x2, y2) {
        const temp = this.__list[y1 * this.__width + x1]
        this.__list[y1 * this.__width + x1] = this.__list[y2 * this.__width + x2]
        this.__list[y2 * this.__width + x2] = temp
        
        this.__render_queue.push(x1, y1)
        this.__render_queue.push(x2, y2)
    }

    frame() {
        return this.__frame
    }

    incrimentFrame() {
        this.__frame++
    }
}