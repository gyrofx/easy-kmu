#! /bin/bash

set -e
# bun run prisma migrate deploy
ls -la /app

node /app/index.mjs
