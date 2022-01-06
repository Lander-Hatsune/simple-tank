import { Status } from "./deps.ts"

const server = Deno.listen({ port: 8080 })
console.log("Server started at 8080")

for await (const conn of server) {
    (async () => {
        const httpConn = Deno.serveHttp(conn)
        for await (const requestEvent of httpConn) {
            handleRequest(requestEvent)
        }
    })()
}

async function handleRequest(request: Deno.RequestEvent) {
    const method = request.request.method
    const pathname = new URL(request.request.url).pathname
    switch (method) {
        case "GET": {
            if (pathname === "/") {
                request.respondWith(
                    new Response (
                        await Deno.readFile('./index.html'),
                        {
                            status: Status.OK,
                            headers: {
                                "content-type": "text/html"
                            },
                        }
                    )
                )
            } else { // route
                if (/favicon.ico/.test(pathname)) {
                    request.respondWith(
                        new Response (
                            await Deno.readFile('.' + pathname),
                            {
                                status: Status.OK,
                                headers: {
                                    "content-type": "image/png"
                                },
                            }
                        )
                    )
                } else if (/scripts\/.*[tj]s/.test(pathname)) {
                    request.respondWith(
                        new Response (
                            await Deno.readFile('.' + pathname),
                            {
                                status: Status.OK,
                                headers: {
                                    "content-type": "text/javascript"
                                },
                            }
                        )
                    )
                } else if (/assets\/.*.png/.test(pathname)) {
                    request.respondWith(
                        new Response (
                            await Deno.readFile('.' + pathname),
                            {
                                status: Status.OK,
                                headers: {
                                    "content-type": "image/png"
                                },
                            }
                        )
                    )
                } else {
                    request.respondWith(
                        new Response ("Path Not accessible",
                                      { status: Status.NotFound })
                    )
                }
            }
            break
        }
        default: {
            request.respondWith(
                new Response ("Method not supported", { status: Status.NotFound })
            )
        }
    }
}
