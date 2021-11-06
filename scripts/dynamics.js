import { Constants,
         objHash } from "./commons.js"
import { sprite_map,
         tank_list,
         bullet_list } from "./objs.js"

export function step() {
    for (const entry of sprite_map) {
        const sprite = entry[1]
        sprite.x += sprite.vx
        sprite.y += sprite.vy
    }
}
