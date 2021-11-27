/*
  axis: +---> x (w)
        |
        v
        y (h)
 */
export const Display = {
    FPS: 60,
    TPS: 200, // ticks per second
    CANVAS_WIDTH: 1920,
    CANVAS_HEIGHT: 1080,
    CANVAS_PADDING: 50,
}

export const Constants = {
    EPS: 0.001,
    BLOCK_SIZE: 10.0,
    WALL_WIDTH: 1.0,
    WALL_HEIGHT: 11.0,
    BULLET_VELOCITY: 0.1, // 2 blocks per sec
    BULLET_RADIUS: 0.5,
    BULLET_INIT_TTL: 100000,
    TANK_WIDTH: 3.25,
    TANK_HEIGHT: 5.5,
    TANK_BARREL_WIDTH: 0.75,
    TANK_BARREL_HEIGHT: 1.0,
    TANK_BODY_HEIGHT: 4.5,
    TANK_BODY_BIAS: [1.75, 2.75],
}

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

export function objHash(obj) {
    return cyrb53(JSON.stringify(obj))
}
