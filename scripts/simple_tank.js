import { Constants } from "./commons.js"
import { genMap,
         drawMap,
         drawSprites,
       } from "./draw.js"
import { tank_list,
         shoot,
         addPlayer,
         step } from "./objs.js"

function blit() {
    drawMap()
    drawSprites()
}

function refresh() {
    /* collision detection */
    step()
}

(function() {
    genMap()

    addPlayer("assets/tank1.png")
    shoot(tank_list[0])
    addPlayer("assets/tank2.png")
    shoot(tank_list[1])

    //blit()
    setInterval(blit, 1000 / Constants.FPS)
    setInterval(refresh, 1000 / Constants.TICK_RATE)
})()

