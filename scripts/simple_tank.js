import { Display } from "./commons.js"
import { initCanvas,
         blitMap,
         drawSprites,
       } from "./draw.js"
import { sprite_map,
         genMap,
         newTank } from "./objs.js"
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

(function main() {
    genMap()
    initCanvas()

    const tank1_id = newTank("assets/tank1.png")

    const tank2_id = newTank("assets/tank2.png")

    const tank1 = sprite_map.get(tank1_id)
    const tank2 = sprite_map.get(tank2_id)

    document.addEventListener("keydown", (event) => {
        switch (event.code) {
        case "ArrowUp":
            tank2.forward = true
            break
        case "ArrowDown":
            tank2.backward = true
            break
        case "ArrowLeft":
            tank2.leftspin = true
            break
        case "ArrowRight":
            tank2.rightspin = true
            break
        case "KeyM": // fire
            tank2.fire = true
            break
        case "KeyE": // ESDF instead of WASD
            tank1.forward = true
            break
        case "KeyD":
            tank1.backward = true
            break
        case "KeyS":
            tank1.leftspin = true
            break
        case "KeyF":
            tank2.rightspin = true
            break
        case "KeyQ": // fire
            tank2.fire = true
            break
        default:
        }
    })

    document.addEventListener("keyup", (event) => {
        switch (event.code) {
        case "ArrowUp":
            tank2.forward = false
            break
        case "ArrowDown":
            tank2.backward = false
            break
        case "ArrowLeft":
            tank2.leftspin = false
            break
        case "ArrowRight":
            tank2.rightspin = false
            break
        case "KeyE": // ESDF instead of WASD
            tank1.forward = false
            break
        case "KeyD":
            tank1.backward = false
            break
        case "KeyS":
            tank1.leftspin = false
            break
        case "KeyF":
            tank2.rightspin = false
            break
        default:
        }
    })

    console.log(sprite_map)

    setInterval(blit, 1000 / Display.FPS)
    setInterval(refresh, 1000 / Display.TPS)
})()

