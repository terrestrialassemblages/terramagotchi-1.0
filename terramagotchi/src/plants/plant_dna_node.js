export class DNANode {
    constructor(parent = null, dna_encoding = null) {
        /**
         * @param {DNANode} parent      Optional parent node for this current node.
         * @param {Array} dna_encoding  Optional encoding to construct a DNA Tree for
         */
        this.parent = parent;

        this.node_type = "stem";
        this.node_activation_level = 10;

        this.stem_angle = 90;
        this.stem_length = 10;
        this.stem_color = "green";
        
        this.stem_curve = "linear";

        // Constant for spherical curve
        this.curve_radius = Math.max(10, (this.stem_length / 2) | 0 + 1);
        this.curve_direction = -1

        if (dna_encoding != null && this.check_encoding(dna_encoding)) {
            this.construct_dna_from_encoding(dna_encoding);

            this.stem_end_thickness =  this.stem_thickness;
            return;
        }

        // Constants for bezier curve
        this.curve_offset_A = [2, 2];
        this.curve_offset_B = [-2, 4];

        this.stem_thickness = 420; // built like a bakery cos I be makin dough
        this.stem_end_thickness =  this.stem_thickness;

        this.children = new Array();
        this.children_weight_growth_direction = true
    }

    get_root() {
        /**
         * Gets root node of DNA sequence (greatest ancestor of all nodes)
         */
        let current_head = this;
        while (this.parent != null && this.parent instanceof DNANode) {
            current_head = current_head.parent;
        }
    }

    get_absolute_angle() {
        /**
         * Retrieves the current DNA branchs absolute current angle
         * Calculated as the sum of the current nodes angle and all ancestor node angles
         */
        let current_node = this
        let current_angle_sum = 0
        while (current_node instanceof DNANode) {
            current_angle_sum += current_node.stem_angle
            current_node = current_node.parent
        }
        return current_angle_sum
    }

    add_child(new_node) {
        /**
         * Adds a child node to current node
         * @param {DNANode} new_node    A new node to be appended to the current nodes children
         */
        if (new_node instanceof DNANode) {
            this.children.push(new_node);
            new_node.parent = this;
        }
    }

    check_encoding(encoding) {
        /**
         * Checks whether an encoding of a plant DNA sequence is valid
         * @param {Array} encoding      An array of data for a node, of form [node_type, node_activation_level, stem_angle, stem_length, stem_curve, stem_color, stem_thickness, children]
         */
        if (!(encoding instanceof Array && encoding.length == 8)) return false;
        if (
            !(
                (typeof encoding[0] === "string" ||
                    encoding[0] instanceof String) &&
                (typeof encoding[1] === "number" ||
                    encoding[1] instanceof Number) &&
                (typeof encoding[2] === "number" ||
                    encoding[2] instanceof Number) &&
                (typeof encoding[3] === "number" ||
                    encoding[3] instanceof Number) &&
                (typeof encoding[4] === "string" ||
                    encoding[4] instanceof String) &&
                (typeof encoding[5] === "string" ||
                    encoding[5] instanceof String) &&
                (typeof encoding[6] === "number" ||
                    encoding[6] instanceof Number) &&
                encoding[7] instanceof Array
            )
        )
            return false;
        return encoding[7].every((child_encoding) =>
            this.check_encoding(child_encoding)
        );
    }

    construct_dna_from_encoding(encoding) {
        /**
         * Constructs
         * @param {Array} encoding      An array of data for a node, of form [node_type, node_activation_level, stem_angle, stem_length, stem_curve, stem_color, stem_thickness, children]
         */

        // Assign encoding DNA
        this.node_type = encoding[0];
        this.node_activation_level = encoding[1];
        this.stem_angle = encoding[2];
        this.stem_length = encoding[3];
        this.stem_curve = encoding[4];
        this.stem_color = encoding[5];
        this.stem_thickness = encoding[6];
        this.children = new Array();

        for (let child_node_encoding of encoding[7]) {
            let new_child = new DNANode(this, child_node_encoding);
            this.add_child(new_child);
        }
    }

    print_dna(prefix = "") {
        /**
         * Prints the dna graph in text
         * @param {String} prefix   Local variable used in recursive calls to format output. If you provide an input the dna string will be returned and not printed.
         */
        let tree_str =
            prefix +
            "├───" +
            [
                this.node_type,
                this.stem_angle,
                this.stem_length,
                this.stem_curve,
                this.stem_color,
                this.stem_thickness,
            ].toString() +
            "\n";

        for (let child of this.children)
            tree_str += child.print_dna(prefix + "│   ");

        if (prefix == "") console.log(tree_str);
        else return tree_str;
    }
}
