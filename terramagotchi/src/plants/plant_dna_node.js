export class DNANode {
    constructor(parent = null, dna_encoding = {}) {
        /**
         * @param {DNANode} parent      Optional parent node for this current node.
         * @param {Object} dna_encoding Optional encoding to construct a DNA Tree.
         */
        this.parent = parent;

        this.node_type = dna_encoding.node_type || "stem"
        this.node_activation_level = dna_encoding.node_activation_level || 0

        this.stem_angle =   dna_encoding.stem_angle || 90;
        this.stem_length =  dna_encoding.stem_length || 10;
        this.color =   dna_encoding.color || "green";
        
        this.stem_curve = dna_encoding.stem_curve || "linear";

        this.stem_thickness =       dna_encoding.stem_thickness ||  3;
        this.stem_end_thickness =   dna_encoding.stem_end_thickness || 1;
        this.bark_start_direction = dna_encoding.bark_start_direction || -1

        // Constant for spherical curve
        this.curve_radius =     dna_encoding.curve_radius || Math.max(10, (this.stem_length / 2) | 0 + 1);
        this.curve_direction =  dna_encoding.curve_direction || -1

        // Constants for bezier curve
        this.curve_offset_A = dna_encoding.curve_offset_A || [2, 2];
        this.curve_offset_B = dna_encoding.curve_offset_B || [-2, 4];

        this.children = new Array();
        this.children_weight_growth_direction = dna_encoding.children_weight_growth_direction || true

        if (dna_encoding.children != null)
            this.construct_dna_from_encoding(dna_encoding.children)
        this.print_dna
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

    construct_dna_from_encoding(children) {
        /**
         * Constructs
         * @param {Array} children  Array of DNA encodings, each element representing a new child node
         */

        for (let child_node_encoding of children) {
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
                // this.stem_angle,
                // this.stem_length,
                // this.stem_curve,
                // this.color,
                // this.stem_thickness,
            ].toString() +
            "\n";

        for (let child of this.children)
            tree_str += child.print_dna(prefix + "│   ");

        if (prefix == "") console.log(tree_str);
        else return tree_str;
    }
}
