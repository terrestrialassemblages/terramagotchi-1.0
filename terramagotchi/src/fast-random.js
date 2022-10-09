const N = 10000000

export class FastRandom {
    static numbers = []
    static pointer = -1

    static random() {
        // Returns a random floating point value in the range [0, 1)
        this.pointer++
        if (this.pointer >= N) this.pointer = 0
        return this.numbers[this.pointer]
    }

    static random_int(max) {
        // Returns a random integer value in the range [0, max)
        return (this.random() * max) | 0
    }
    
    static {
        for (let i = 0; i < N; i++) {
            this.numbers.push(Math.random())
        }
    }
}
