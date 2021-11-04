export function drawRect(x, y, w, h, c, ctx) {
    ctx.fillStyle = c
    ctx.fillRect(x, y, w, h)
}

export function drawCircle(x, y, r, c, ctx) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()
}
