import { FastRandom } from "../../fast-random"

const KAURI = "KAURI"
const LAVENDER = "LAVENDER"
const PUMPKIN = "PUMPKIN"
const SUNFLOWER = "SUNFLOWER"

/**
 * Generates a DNA-Tree for which a particle can take
 * @param {String}  TREE_TYPE   The type of tree to make.
 *                              Default is sunflower
 * @returns {Object}    Returns a nested object of plant characteristics
 */
export function generate_tree_dna(TREE_TYPE=LAVENDER) {
let tree_direction, tree_scale, tree_angle_offset, tree_height, tree_color
switch (TREE_TYPE) {
    case KAURI:
        tree_direction = [-1, 1][FastRandom.int_max(1)]
        tree_angle_offset = FastRandom.int_min_max(15, 25)
        tree_height = 16//FastRandom.int_min_max(10, 14)
        tree_color = "#8B341F"

        function section_factory(height, width) {
            return {
                seed_activation_level: 300,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: 0,
                stem_length: height,
                stem_curve: "linear",
                stem_thickness: width,
                stem_end_thickness: width,
                children: []
            }
        }
        
        let section_1 = section_factory(14, 6)
        let section_2 = section_factory(6, 6)
        let section_3 = section_factory(4, 4)
        let section_4 = section_factory(6, 4)
        let section_5 = section_factory(8, 4)
        let section_6 = section_factory(8, 4)
        let section_7 = section_factory(2, 2)
        let section_8 = section_factory(8, 2)
        
        section_1.stem_angle = 90
        section_1.root_node_spawn_distance = 5
        section_1.root_length_max = 40
        section_1.root_max_curve_length = 4
        section_1.root_minimum_distance = 8

        section_1.children.push({
            seed_activation_level: 0,
            node_activation_level: 1,
            RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
            color: tree_color,
            stem_angle: 40,
            stem_length: 10,
            stem_thickness: 2,
            stem_end_thickness: 2,
            stem_curve: "linear",
            children: [
                {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: -30,
                stem_length: 9,
                stem_thickness: 2,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 7,
                curve_direction: -1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
            {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: 30,
                stem_length: 7,
                stem_thickness: 1,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 3,
                curve_direction: -1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
            {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: -55,
                stem_length: 6,
                stem_thickness: 1,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 10,
                curve_direction: 1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
        ]
        })

        section_3.children.push({
            seed_activation_level: 0,
            node_activation_level: 1,
            RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
            color: tree_color,
            stem_angle: -40,
            stem_length: 6,
            stem_thickness: 2,
            stem_end_thickness: 2,
            stem_curve: "linear",
            children: [
                {
                    seed_activation_level: 0,
                    node_activation_level: 1,
                    RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                    color: tree_color,
                    stem_angle: -5,
                    stem_length: 3,
                    stem_thickness: 2,
                    stem_end_thickness: 2,
                    stem_curve: "linear",
                    children: [
                        {seed_activation_level: 0,
                        node_activation_level: 1,
                        RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                        color: tree_color,
                        stem_angle: 30,
                        stem_length: 3,
                        stem_thickness: 2,
                        stem_end_thickness: 1,
                        stem_curve: "spherical",
                        curve_radius: 100,
                        curve_direction: 1,
                        children: [{
                            node_type: "flower",
                            color: "#087830",
                            secondary_color: "#059033",
                            secondary_color_length: 2,
                            node_activation_level: 1,
                            use_angle_absolute: true,
                            // growth_destructive: true,
                            stem_angle: 90,
                            stem_length: 1,
                            leaf_shape: "sunflower",
                            leaf_size: 3,
                        }]}
                    ]
                }
            ]
        })

        section_4.children.push({
            seed_activation_level: 0,
            node_activation_level: 1,
            RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
            color: tree_color,
            stem_angle: 40,
            stem_length: 10,
            stem_thickness: 2,
            stem_end_thickness: 2,
            stem_curve: "linear",
            children: [
                {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: -30,
                stem_length: 9,
                stem_thickness: 2,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 7,
                curve_direction: -1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
            {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: 30,
                stem_length: 7,
                stem_thickness: 1,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 3,
                curve_direction: -1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
            {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: -55,
                stem_length: 6,
                stem_thickness: 1,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 10,
                curve_direction: 1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
        ]
        })

        section_5.children.push({
            seed_activation_level: 0,
            node_activation_level: 1,
            RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
            color: tree_color,
            stem_angle: -40,
            stem_length: 10,
            stem_thickness: 2,
            stem_end_thickness: 2,
            stem_curve: "linear",
            children: [
                {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: 30,
                stem_length: 9,
                stem_thickness: 2,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 7,
                curve_direction: 1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
            {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: -20,
                stem_length: 7,
                stem_thickness: 1,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 3,
                curve_direction: 1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
            {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: 55,
                stem_length: 6,
                stem_thickness: 1,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 10,
                curve_direction: -1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
        ]
        })

        section_7.children.push({
            seed_activation_level: 0,
            node_activation_level: 1,
            RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
            color: tree_color,
            stem_angle: 40,
            stem_length: 10,
            stem_thickness: 2,
            stem_end_thickness: 2,
            stem_curve: "linear",
            children: [
                {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: -30,
                stem_length: 9,
                stem_thickness: 2,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 7,
                curve_direction: -1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
            {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: 30,
                stem_length: 7,
                stem_thickness: 1,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 3,
                curve_direction: -1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
            {
                seed_activation_level: 0,
                node_activation_level: 1,
                RANDOM_WEIGHT_GROWWTH_DIRECTION: false,
                color: tree_color,
                stem_angle: -55,
                stem_length: 6,
                stem_thickness: 1,
                stem_end_thickness: 1,
                stem_curve: "spherical",
                curve_radius: 10,
                curve_direction: 1,
                children: [{
                    node_type: "flower",
                    color: "#087830",
                    secondary_color: "#059033",
                    secondary_color_length: 2,
                    node_activation_level: 1,
                    use_angle_absolute: true,
                    // growth_destructive: true,
                    stem_angle: 90,
                    stem_length: 1,
                    leaf_shape: "sunflower",
                    leaf_size: 3,
                }]
            },
        ]
        })

        section_8.children.push({
            node_type: "flower",
            color: "#087830",
            secondary_color: "#059033",
            secondary_color_length: 2,
            node_activation_level: 1,
            use_angle_absolute: true,
            // growth_destructive: true,
            stem_angle: 90,
            stem_length: 1,
            leaf_shape: "sunflower",
            leaf_size: 3,
        })



        section_1.children.push(section_2)
        section_2.children.push(section_3)
        section_3.children.push(section_4)
        section_4.children.push(section_5)
        section_5.children.push(section_6)
        section_6.children.push(section_7)
        section_7.children.push(section_8)

        return section_1

    case LAVENDER:
        tree_direction = [-1, 1][FastRandom.int_max(1)]
        tree_angle_offset = FastRandom.int_min_max(15, 25)
        tree_height = FastRandom.int_min_max(4, 7)

        let first_node = {
            root_node_spawn_distance: 6,
            root_length_max: 5,
            root_max_curve_length: 2,
            root_minimum_distance: 1,


            seed_activation_level: 0,
            node_activation_level: 1,
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
                node_activation_level: 1,
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
                node_activation_level: 1,
                stem_angle: -2*((-1)**i)*tree_direction*tree_angle_offset,
                color: "#E1DAE1",
                leaf_shape: "lavender",
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
    default:
        tree_direction = [-1, 1][FastRandom.int_max(1)]
        tree_angle_offset = -14
        return {
            root_node_spawn_distance: 6,
            root_length_max: 5,
            root_max_curve_length: 2,
            root_minimum_distance: 1,
            seed_activation_level: 0,
            node_activation_level: 1,
            color: "#3F7B25", // color inspo: https://colorswall.com/palette/34441
            stem_angle: 90 + tree_direction*tree_angle_offset,
            stem_length: FastRandom.int_min_max(5, 6),
            stem_curve: "spherical",
            stem_thickness: 1,
            stem_end_thickness: 1,
            curve_radius: 4,
            curve_direction: tree_direction,
            children: [{
                node_type: "leaf",
                node_activation_level: 1,
                stem_angle: -tree_direction*tree_angle_offset-tree_direction*90,
                color: "#22B14C",
                leaf_shape: "flat-top",
                leaf_size: 2,
                leaf_direction: tree_direction,
                children: []
            },
            {
                node_activation_level: 1,
                color: "#3F7B25",
                stem_angle: -tree_direction*tree_angle_offset+tree_direction*45,
                stem_length: FastRandom.int_min_max(1, 2),
                stem_curve: "linear",
                stem_thickness: 1,
                stem_end_thickness: 1,
                curve_radius: 0,
                curve_direction: -tree_direction,
                children: [{
                    node_type: "leaf",
                    node_activation_level: 1,
                    stem_angle: -tree_direction*45+tree_direction*90,
                    color: "#22B14C",
                    leaf_shape: "flat-top",
                    leaf_size: 2,
                    leaf_direction: -tree_direction,
                    children: []
                },
                {
                    node_activation_level: 1,
                    color: "#3F7B25",
                    stem_angle: -tree_direction*45,
                    stem_length: FastRandom.int_min_max(2, 3),
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
                        node_activation_level: 1,
                        use_angle_absolute: true,
                        // growth_destructive: true,
                        stem_angle: 90,
                        stem_length: 1,
                        leaf_shape: "sunflower",
                        leaf_size: 3,
                        curve_direction: -tree_direction,
                    }]
                }]
            }]
        }
}}