import { Display } from "./commons.js"
import { initCanvas,
         blitMap,
         drawSprites,
       } from "./draw.js"
import { sprite_map,
         genMap,
         newTank,
         newBullet } from "./objs.js"
import { collide,
         step } from "./dynamics.js"

function blit() {
    blitMap()
    drawSprites()
}

function refresh() {
    // resolve collision after taking a step,
    // avoiding jittering problem. 
    step()
    collide()
}

(function() {
    genMap()
    initCanvas()

    const tank1_id = newTank("assets/tank1.png")
    newBullet(tank1_id)
    //const tank2_id = newTank("assets/tank2.png")
    //newBullet(tank2_id)

    console.log(sprite_map)

    setInterval(blit, 1000 / Display.FPS)
    setInterval(refresh, 1000 / Display.TPS)
})()

