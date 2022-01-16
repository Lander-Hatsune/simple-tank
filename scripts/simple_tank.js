import { Display } from "./commons.js"
import { initCanvas,
         blitMap,
         drawSprites,
         incScore
       } from "./draw.js"
import { sprite_map,
         winner_id,
         setWinner,
         newTank,
         initMap } from "./objs.js"
import { prestep,
         step,
         collide } from "./dynamics.js"

let tank1_id, tank2_id

function blit() {
    blitMap()
    drawSprites()
}

function refresh() {
    prestep()

    if (winner_id) {
        incScore(winner_id == tank1_id ? 1 : 2)
        gameStart()
        return
    }
    
    step()
    collide()
}

function gameStart() {
    initMap()
    initCanvas()

    tank1_id = newTank("assets/tank1.png")
    
    tank2_id = newTank("assets/tank2.png")

    const tank = (i) => sprite_map.get([tank1_id, tank2_id][i])

    document.addEventListener("keydown", (event) => {
        switch (event.code) {
        case "ArrowUp":
            tank(1).forward = true
            break
        case "ArrowDown":
            tank(1).backward = true
            break
        case "ArrowLeft":
            tank(1).leftspin = true
            break
        case "ArrowRight":
            tank(1).rightspin = true
            break
        case "KeyM": // fire
            tank(1).fire = true
            break
        case "KeyE": // ESDF instead of WASD
            tank(0).forward = true
            break
        case "KeyD":
            tank(0).backward = true
            break
        case "KeyS":
            tank(0).leftspin = true
            break
        case "KeyF":
            tank(0).rightspin = true
            break
        case "KeyQ": // fire
            tank(0).fire = true
            break
        default:
        }
    })

    document.addEventListener("keyup", (event) => {
        switch (event.code) {
        case "ArrowUp":
            tank(1).forward = false
            break
        case "ArrowDown":
            tank(1).backward = false
            break
        case "ArrowLeft":
            tank(1).leftspin = false
            break
        case "ArrowRight":
            tank(1).rightspin = false
            break
        case "KeyE": // ESDF instead of WASD
            tank(0).forward = false
            break
        case "KeyD":
            tank(0).backward = false
            break
        case "KeyS":
            tank(0).leftspin = false
            break
        case "KeyF":
            tank(0).rightspin = false
            break
        default:
        }
    })

    console.log(sprite_map)
}

(function main() {
    setInterval(blit, 1000 / Display.FPS)
    setInterval(refresh, 1000 / Display.TPS)
    gameStart()
})()

