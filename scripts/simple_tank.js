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

    const tank1_hash = newTank("assets/tank1.png")
    newBullet(tank1_hash)
    //const tank2_hash = newTank("assets/tank2.png")
    //newBullet(tank2_hash)

    console.log(sprite_map)

    setInterval(blit, 1000 / Display.FPS)
    setInterval(refresh, 1000 / Display.TPS)
})()

