#! /bin/zsh

FLAG_WATCH="--watch"

if [[ $1=$FLAG_WATCH ]]
then
    deno run --watch --allow-net --allow-read server.ts
else
    deno run --allow-net --allow-read server.ts
fi
