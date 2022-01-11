/*
  axis: +---> x (w)
        |
        v
        y (h)

  angle:
           0
           |
   3pi/2 --+-- pi/2
           |
           pi
*/

export const Display = {
    FPS: 60,
    TPS: 200, // ticks per second
    CANVAS_WIDTH: 1080,
    CANVAS_HEIGHT: 1080,
    CANVAS_PADDING: 50,
}

export const MapSize = {
    MINL: 4,
    MAXL: 7,
}

export const Constants = {
    EPS: 0.001,
    BLOCK_SIZE: 10.0,
    WALL_WIDTH: 1.0,
    WALL_HEIGHT: 11.0,
    BULLET_V: 22.5 / Display.TPS,
    BULLET_RADIUS: 0.4,
    BULLET_INIT_TTL: 10 * Display.TPS,
    TANK_WIDTH: 3.25,
    TANK_HEIGHT: 5.5,
    TANK_BARREL_WIDTH: 0.75,
    TANK_BARREL_HEIGHT: 1.0,
    TANK_HEIGHT_BIAS: 3.25,
    TANK_BODY_HEIGHT: 4.5,
    TANK_V_FORWARD: 20 / Display.TPS,
    TANK_V_BACKWARD: -12.5 / Display.TPS,
    TANK_EPS: 0.2,
    TANK_SPIN_V_ANG: -1.5 * Math.PI / Display.TPS, 
}

// https://stackoverflow.com/a/52171480
const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^
        Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^
        Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
}

export function randHash() {
    return cyrb53(Math.random().toString())
}
