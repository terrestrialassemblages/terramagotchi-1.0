const N = 10000000

export class FastRandom {
    static numbers = []
    static pointer = -1

    static random() {
        /**
         * Returns a random floating point value in the range [0, 1) (0 incluse, 1 exclusive)
         */
        this.pointer++
        if (this.pointer >= N) this.pointer = 0
        return this.numbers[this.pointer]
    }

    static int_max(max) {
        /**
         * Returns a random integer value in the range [0, max] (both inclusive)
         */
        return (this.random() * (max + 1)) | 0
    }

    static int_min_max(min, max) {
        /**
         * Returns a random integer value in the range [min, max] (both inclusive)
         */
        return (min + this.random() * (max + 1 - min)) | 0
    }

    static choice(list) {
        /**
         * Returns a random item from the list.
         */
        return list[(this.random() * list.length) | 0]
    }

    static {
        for (let i = 0; i < N; i++) {
            this.numbers.push(Math.random())
        }
    }
}
