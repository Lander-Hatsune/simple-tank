import { Constants } from "./commons.js"
import { add,
         sub,
         dot,
         squaredLen,
         len,
         squaredDis,
         dis,
         scale,
         rot,
         trans,
         rotateAndTranslateBox,
         barrelBox,
         bodyBox } from "./maths.js"
import { sprite_map } from "./objs.js"

const colli_prio = {
    NAH: -1,
    WALL_CORNER: 0,
    WALL_EDGE: 1,
    TANK: 2
};

export function collide() {
    // walls, tanks, bullets
    // ex. bullet as hitter, wall as hittee
    for (const [hitterhash, hitter] of sprite_map.entries()) {
        let new_hitter = hitter
        let hit_prio = colli_prio.NAH
        let hitter_deleted = false
        for (const [hitteehash, hittee] of sprite_map.entries()) {
            if (hitter_deleted) break
            switch (hittee.type + "&" + hitter.type) {
            case "wall&tank":
                break

            case "wall&bullet":
                const test_x = (hitter.x < hittee.x) ? hittee.x :
                    (hitter.x > hittee.x + hittee.w) ? hittee.x + hittee.w :
                    hitter.x
                const test_y = (hitter.y < hittee.y) ? hittee.y :
                      (hitter.y > hittee.y + hittee.h) ? hittee.y + hittee.h :
                      hitter.y
                const bool_hit = ((test_x - hitter.x) ** 2 +
                                  (test_y - hitter.y) ** 2) < hitter.r ** 2
                if (bool_hit) {
                    const hit_prio_temp = (test_x == hitter.x ||
                                           test_y == hitter.y) ?
                          colli_prio.WALL_EDGE : colli_prio.WALL_CORNER
                    if (hit_prio_temp > hit_prio) {
                        hit_prio = hit_prio_temp
                        new_hitter.vx = (test_x == hitter.x) ?
                            hitter.vx : -hitter.vx
                        new_hitter.vy = (test_y == hitter.y) ?
                            hitter.vy : -hitter.vy
                    }
                }
                break

            case "tank&bullet":
                const body_box = bodyBox(hittee)
                for (let i = 1; i <= 4; i++) {
                    // segment ab collides with circle c
                    const a = body_box[i - 1]
                    const b = body_box[i % 4]
                    const c = [hitter.x, hitter.y]
                    // closest point to c on segment ab
                    const closest = add(a, scale(sub(b, a),
                                                 dot(sub(b, a), sub(c, a)) /
                                                 squaredDis(b, a)))

                    if (squaredDis(c, closest) <= Constants.BULLET_RADIUS ** 2 &&
                        closest[0] >= Math.min(a[0], b[0]) &&
                        closest[0] <= Math.max(a[0], b[0]) &&
                        closest[1] >= Math.min(a[1], b[1]) &&
                        closest[1] <= Math.max(a[1], b[1])) {
                        const hit_prio_temp = colli_prio.TANK
                        if (hit_prio_temp > hit_prio) {
                            hitter_deleted = true
                            sprite_map.delete(hitterhash)
                            sprite_map.delete(hitteehash)
                            break
                        }
                    }
                }
                break

            default:
                continue
            }
        }
        if (hit_prio != colli_prio.NAH)
            sprite_map.set(hitterhash, new_hitter)
    }
}

export function step() {
    for (const [hash, sprite] of sprite_map.entries()) {
        if (sprite.vx && sprite.vy) {
            sprite.x += sprite.vx
            sprite.y += sprite.vy
        }
        if (sprite.ttl) {
            sprite.ttl -= 1
            if (sprite.ttl <= 0)
                sprite_map.delete(hash)
        }
    }
}
