import { Constants } from "./commons.js"

export const norm = (vec) => scale(vec, 1 / squaredLen(vec))

export const add = (vec1, vec2) => [vec1[0] + vec2[0],
                                    vec1[1] + vec2[1]]

export const sub = (vec1, vec2) => [vec1[0] - vec2[0],
                                    vec1[1] - vec2[1]]

export const dot = (vec1, vec2) => vec1[0] * vec2[0] + vec1[1] * vec2[1]

export const squaredLen = (vec) => vec[0] ** 2 + vec[1] ** 2

export const len = (vec) => Math.sqrt(squaredLen(vec))

export const squaredDis = (vec1, vec2) => squaredLen(sub(vec1, vec2))

export const dis = (vec1, vec2) => len(sub(vec1, vec2))

export const scale = (vec, s) => [vec[0] * s, vec[1] * s]

export const rot = (vec, angle) =>
      [vec[0] * Math.cos(angle) - vec[1] * Math.sin(angle),
       vec[0] * Math.sin(angle) + vec[1] * Math.cos(angle)]

export const trans = (vec, x, y) => [vec[0] + x, vec[1] + y]

export const rotAndTransPoly = (poly, angle, x, y) => {
    for (let i = 0; i < poly.length; i += 1) {
        poly[i] = trans(rot(poly[i], angle), x, y)
    }
    return poly
}

export const tankBodyBox = (tank) => rotAndTransPoly(
    [[-Constants.TANK_WIDTH / 2, Constants.TANK_BODY_HEIGHT / 2],
     [Constants.TANK_WIDTH / 2, Constants.TANK_BODY_HEIGHT / 2],
     [Constants.TANK_WIDTH / 2, -Constants.TANK_BODY_HEIGHT / 2],
     [-Constants.TANK_WIDTH / 2, -Constants.TANK_BODY_HEIGHT / 2]],
    tank.angle, tank.x, tank.y)

export const tankPoly = (tank) => rotAndTransPoly(
    [[-Constants.TANK_WIDTH / 2, Constants.TANK_BODY_HEIGHT / 2],
     [Constants.TANK_WIDTH / 2, Constants.TANK_BODY_HEIGHT / 2],
     [Constants.TANK_WIDTH / 2, -Constants.TANK_BODY_HEIGHT / 2],
     [Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_BODY_HEIGHT / 2],
     [Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_HEIGHT_BIAS],
     [-Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_HEIGHT_BIAS],
     [-Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_BODY_HEIGHT / 2],
     [-Constants.TANK_WIDTH / 2, -Constants.TANK_BODY_HEIGHT / 2]],
    tank.angle, tank.x, tank.y)
