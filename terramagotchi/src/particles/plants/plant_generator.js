
const PALM_TREE = "PALM"

function randint(start, end=null) {
    if (!(end))
        [start, end] = [0, start]
    return start + Math.random() * (end - start + 1) | 0
}

export default function generate_tree_dna(TREE_TYPE="PALM") {
switch (TREE_TYPE) {
    case PALM_TREE:
        let tree_direction = [-1, 1][randint(1)]
        return {
            node_activation_level: 0,
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
                    node_activation_level: 0,
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
                    node_activation_level: 0,
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
                    node_activation_level: 0,
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
                    node_activation_level: 0,
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
                    node_activation_level: 0,
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