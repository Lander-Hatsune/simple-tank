import { Constants } from "./commons.js"
import { drawMap,
         drawSprites,
       } from "./draw.js"
import { tank_list,
         genMap,
         newTank,
         newBullet } from "./objs.js"
import { collide,
         step } from "./dynamics.js"

function blit() {
    drawMap()
    drawSprites()
}

function refresh() {
    collide()    
    step()
}

(function() {
    genMap()

    newTank("assets/tank1.png")
    newBullet(tank_list[0])
    newTank("assets/tank2.png")
    newBullet(tank_list[1])

    //setInterval(blit, 1000 / Constants.FPS)
    //setInterval(refresh, 1000 / Constants.TICK_RATE)
})()

