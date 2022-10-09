const N = 1000000

export class FastRandom {
    static numbers = []
    static pointer = -1

    static random() {
        this.pointer++
        if (this.pointer >= N) this.pointer = 0
        return this.numbers[this.pointer]
    }

    static random_int(max) {
        return (this.random() * max) | 0
    }
    
    static {
        for (let i = 0; i < N; i++) {
            this.numbers.push(Math.random())
        }
    }
}
