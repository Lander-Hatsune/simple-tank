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
         step,
         tankForward,
         tankBackward,
         tankStopMove,
         tankSpinLeft,
         tankSpinRight,
         tankStopSpin } from "./dynamics.js"

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

    document.addEventListener("keydown", (event) => {
        switch (event.code) {
        case "ArrowUp":
            tankForward(tank2_id)
            break
        case "ArrowDown":
            tankBackward(tank2_id)
            break
        case "ArrowLeft":
            tankSpinLeft(tank2_id)
            break
        case "ArrowRight":
            tankSpinRight(tank2_id)
            break
        case "KeyM": // fire
            newBullet(tank2_id)
            break
        case "KeyE": // ESDF instead of WASD
            tankForward(tank1_id)
            break
        case "KeyD":
            tankBackward(tank1_id)
            break
        case "KeyS":
            tankSpinLeft(tank1_id)
            break
        case "KeyF":
            tankSpinRight(tank1_id)
            break
        case "KeyQ": // fire
            newBullet(tank1_id)
            break
        default:
        }
    })

    document.addEventListener("keyup", (event) => {
        switch (event.code) {
        case "ArrowUp":
        case "ArrowDown":
            tankStopMove(tank2_id)
            break
        case "ArrowLeft":
        case "ArrowRight":
            tankStopSpin(tank2_id)
            break
        case "KeyE":
        case "KeyD":
            tankStopMove(tank1_id)
            break
        case "KeyS":
        case "KeyF":
            tankStopSpin(tank1_id)
            break
        default:
        }
    })

    console.log(sprite_map)

    setInterval(blit, 1000 / Display.FPS)
    setInterval(refresh, 1000 / Display.TPS)
})()

