import { Constants,
         MapSize } from "./commons.js"
import { randInt } from "./maths.js"
import { map_size } from "./objs.js"

/* 
   only focus on top & left side
   +-- : horiz
   |   : vert
*/
export function genMap() {
    let map_ = new Array(map_size.height + 1).fill("blank").map(
        () => Array(map_size.width + 1).fill("blank"))

    for (let row = 0; row < map_size.height; row++) {
        for (let col = 0; col < map_size.width; col++) {
            let r = randInt(7)
            if (r == 0) continue
            if (r <= 3) map_[row][col] = "vert"
            else map_[row][col] = "horiz"
        }
    }
    return map_
}

function dfs(row, col, regions, map_, c) {
    regions[row][col] = c
    // up
    if (row > 0 &&
        !regions[row - 1][col] &&
        map_[row][col] !== "horiz")
        dfs(row - 1, col, regions, map_, c)
    // left
    if (col > 0 &&
        !regions[row][col - 1] &&
        map_[row][col] !== "vert")
        dfs(row, col - 1, regions, map_, c)
    // down
    if (row < map_size.height - 1 &&
        !regions[row + 1][col] &&
        map_[row + 1][col] !== "horiz")
        dfs(row + 1, col, regions, map_, c)
    // right
    if (col < map_size.width - 1 &&
        !regions[row][col + 1] &&
        map_[row][col + 1] !== "vert")
        dfs(row, col + 1, regions, map_, c)
}

// give the largest connected block
export function validateMap(map_) {
    let regions = new Array(map_size.height).fill(0).map(
        () => Array(map_size.width).fill(0))
    let c = 0
    for (let i = 0; i < map_size.height; i++) {
        for (let j = 0; j < map_size.width; j++) {
            if (!regions[i][j])
                dfs(i, j, regions, map_, ++c)
        }
    }
    let cnt_c = new Array(c + 1).fill(0)
    let max_c = [0, 0] // [color, cnt]
    for (let i = 0; i < map_size.height; i++) {
        for (let j = 0; j < map_size.width; j++) {
            cnt_c[regions[i][j]] += 1
            if (cnt_c[regions[i][j]] > max_c[1]) {
                max_c[0] = regions[i][j]
                max_c[1] = cnt_c[regions[i][j]]
            }
        }
    }
    return [max_c[1] > map_size.height * map_size.width / 2,
            regions, max_c[0]]
}


