export const Constants = {
    FPS: 60,
    TPS: 100, // ticks per second
    CANVAS_HEIGHT: 800,
    WALL_WIDTH: 8,
    BULLET_VELOCITY: 1,
    BULLET_RADIUS: 7,
    TANK_WIDTH: 60,
    TANK_HEIGHT: 96,
    TANK_BODY_BIAS: [32, 48],
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
    return cyrb53(JSON.stringify(obj) + Date.now())
}