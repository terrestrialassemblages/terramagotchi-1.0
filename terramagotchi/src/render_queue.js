export class RenderQueue {
    constructor() {
        this.__queue_x = new Array()
        this.__queue_y = new Array()
    }

    push(x, y) {
        this.__queue_x.push(x)
        this.__queue_y.push(y)
    }

    pop() {
        return [this.__queue_x.pop(), this.__queue_y.pop()]
    }

    size() {
        return this.__queue_x.length
    }
}