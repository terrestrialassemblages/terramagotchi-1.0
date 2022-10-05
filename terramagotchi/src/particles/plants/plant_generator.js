
const PALM_TREE = "PALM"
const SUNFLOWER = "SUNFLOWER"
const LAVENDER = "LAVENDER"

function randint(start, end=null) {
    if (!(end))
        [start, end] = [0, start]
    return start + Math.random() * (end - start + 1) | 0
}

export default function generate_tree_dna(TREE_TYPE=SUNFLOWER) {
let tree_direction, tree_scale, tree_angle_offset, tree_height
switch (TREE_TYPE) {
    case LAVENDER:
        tree_direction = [-1, 1][randint(1)]
        tree_angle_offset = randint(15, 25)
        tree_height = randint(4, 7)

        let first_node = {
            node_activation_level: 2,
            color: "#3F7B25",
            stem_curve: "spherical",
            stem_angle: 90+tree_direction*tree_angle_offset,
            stem_length: 4,
            stem_thickness: 1,
            stem_end_thickness: 1,
            curve_radius: 1,
            curve_direction: tree_direction,
            children: [],
        }
        let current_node = first_node
        for (let i = 1; i < tree_height; i++) {
            current_node.children.push({
                node_activation_level: 2,
                color: "#3F7B25",
                stem_curve: "linear",
                stem_angle: 2*((-1)**i)*tree_direction*tree_angle_offset,
                stem_length: 4,
                stem_thickness: 1,
                stem_end_thickness: 1,
                curve_radius: 1,
                curve_direction: ((-1)**i)*tree_direction,
                children: [],
            })
            current_node.children.push({
                node_type: "flower",
                node_activation_level: 2,
                stem_angle: -2*((-1)**i)*tree_direction*tree_angle_offset,
                color: "#E1DAE1",
                leaf_shape: "flat-top",
                leaf_size: 3,
                leaf_direction: ((-1)**i)*tree_direction,
                secondary_color: "#FBF3FB",
                secondary_color_length: 2,
                children: []
            })
            current_node = current_node.children[0]
        }
        return first_node

    case SUNFLOWER:
        tree_direction = [-1, 1][randint(1)]
        tree_angle_offset = -14
        return {
            node_activation_level: 2,
            color: "#3F7B25", // color inspo: https://colorswall.com/palette/34441
            stem_angle: 90 + tree_direction*tree_angle_offset,
            stem_length: randint(5, 6),
            stem_curve: "spherical",
            stem_thickness: 1,
            stem_end_thickness: 1,
            curve_radius: 4,
            curve_direction: tree_direction,
            children: [{
                node_type: "leaf",
                node_activation_level: 2,
                stem_angle: -tree_direction*tree_angle_offset-tree_direction*90,
                color: "#22B14C",
                leaf_shape: "flat-top",
                leaf_size: 2,
                leaf_direction: tree_direction,
                children: []
            },
            {
                node_activation_level: 2,
                color: "#3F7B25",
                stem_angle: -tree_direction*tree_angle_offset+tree_direction*45,
                stem_length: randint(1, 2),
                stem_curve: "linear",
                stem_thickness: 1,
                stem_end_thickness: 1,
                curve_radius: 0,
                curve_direction: -tree_direction,
                children: [{
                    node_type: "leaf",
                    node_activation_level: 2,
                    stem_angle: -tree_direction*45+tree_direction*90,
                    color: "#22B14C",
                    leaf_shape: "flat-top",
                    leaf_size: 2,
                    leaf_direction: -tree_direction,
                    children: []
                },
                {
                    node_activation_level: 2,
                    color: "#3F7B25",
                    stem_angle: -tree_direction*45,
                    stem_length: randint(2, 3),
                    stem_curve: "linear",
                    stem_thickness: 1,
                    stem_end_thickness: 1,
                    curve_radius: 0,
                    curve_direction: -tree_direction,
                    children: [{
                        node_type: "flower",
                        color: "#DDDD00",
                        secondary_color: "#FFFF00",
                        secondary_color_length: 2,
                        node_activation_level: 2,
                        use_angle_absolute: true,
                        // growth_destructive: true,
                        stem_angle: 0,
                        stem_length: 1,
                        leaf_shape: "sunflower",
                        leaf_size: 3,
                        curve_direction: -tree_direction,
                    }]
                }]
            }]
        }

    case PALM_TREE:
        tree_direction = [-1, 1][randint(1)]
        return {
            node_activation_level: 2,
            // color: "#FF0000",
            color: "#8B341F", // https://www.vyond.com/resources/20-color-palettes-for-your-brand-design/
            stem_angle: 90,
            stem_length: 40,
            stem_curve: "spherical",
            stem_thickness: 5,
            stem_end_thickness: 3,
            curve_radius: randint(10, 20),
            curve_direction: tree_direction,
            children: [
                {
                    node_activation_level: 2,
                    color: "#4a8703", // color inspo: https://colorswall.com/palette/34441
                    stem_angle: tree_direction*130,
                    stem_length: 30,
                    stem_curve: "spherical",
                    stem_thickness: 2,
                    stem_end_thickness: 1,
                    curve_radius: 10,
                    curve_direction: tree_direction,
                },
                {
                    node_activation_level: 2,
                    color: "#4a8703", // color inspo: https://colorswall.com/palette/34441
                    stem_angle: tree_direction*110,
                    stem_length: 35,
                    stem_curve: "spherical",
                    stem_thickness: 2,
                    stem_end_thickness: 1,
                    curve_radius: 5,
                    curve_direction: tree_direction,
                },
                {
                    node_activation_level: 2,
                    color: "#4a8703", // color inspo: https://colorswall.com/palette/34441
                    stem_angle: tree_direction*75,
                    stem_length: 35,
                    stem_curve: "spherical",
                    stem_thickness: 2,
                    stem_end_thickness: 1,
                    curve_radius: 10,
                    curve_direction: tree_direction,
                },
                {
                    node_activation_level: 2,
                    color: "#4a8703", // color inspo: https://colorswall.com/palette/34441
                    stem_angle: tree_direction*-90,
                    stem_length: 35,
                    stem_curve: "spherical",
                    stem_thickness: 2,
                    stem_end_thickness: 1,
                    curve_radius: 5,
                    curve_direction: -tree_direction,
                },
                {
                    node_activation_level: 2,
                    color: "#4a8703", // color inspo: https://colorswall.com/palette/34441
                    stem_angle: tree_direction*-120,
                    stem_length: 25,
                    stem_curve: "spherical",
                    stem_thickness: 2,
                    stem_end_thickness: 1,
                    curve_radius: 5,
                    curve_direction: -tree_direction,
                },
            ],
        }
}}