#! /bin/bash

set -e
# bun run prisma migrate deploy
ls -la /app
ls -la /app/node_modules/@easy-kmu/common
node /app/index.mjs
