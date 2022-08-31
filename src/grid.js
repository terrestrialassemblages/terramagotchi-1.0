export class Grid {
    constructor(width, height, default_type = null) {
        this.__width = width
        this.__height = height
        this.__list = new Array(width * height).fill(default_type)
    }

    get(x, y) {
        return this.__list[y * this.__width + x]
    }

    set(x, y, value) {
        this.__list[y * this.__width + x] = value
    }
}