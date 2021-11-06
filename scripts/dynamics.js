import { Constants,
         objHash } from "./commons.js"
import { sprite_map,
         tank_list,
         bullet_list } from "./objs.js"

export function collide() {
    for (const [, hitter] of sprite_map.entries()) {
        for (const [, hittee] of sprite_map.entries()) {
            switch (hitter.type) {
            case "bullet":
                
                break
            case "tank":
                break
            default:
                
            }
        }
    }
}

export function step() {
    for (const [, sprite] of sprite_map.entries()) {
        sprite.x += sprite.vx
        sprite.y += sprite.vy
    }
}
