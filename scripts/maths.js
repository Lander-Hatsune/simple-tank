import { Constants } from "./commons.js"
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

export const rotateAndTranslateBox = (box, angle, x, y) => 
      [trans(rot(box[0], angle), x, y),
       trans(rot(box[1], angle), x, y),
       trans(rot(box[2], angle), x, y),
       trans(rot(box[3], angle), x, y)]

export const barrelBox = (tank) => rotateAndTranslateBox(
    [[-Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_HEIGHT / 2],
     [Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_HEIGHT / 2],
     [-Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]],
     [Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]]],
    tank.angle, tank.x, tank.y)

export const bodyBox = (tank) => rotateAndTranslateBox(
    [[-Constants.TANK_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]],
     [Constants.TANK_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]],
     [Constants.TANK_WIDTH / 2, Constants.TANK_BODY_BIAS[1]],
     [-Constants.TANK_WIDTH / 2, Constants.TANK_BODY_BIAS[1]]],
    tank.angle, tank.x, tank.y)