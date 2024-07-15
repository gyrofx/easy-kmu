# prisma generate fails on docker: https://github.com/prisma/prisma/issues/21241#issuecomment-1860605624
FROM node:22 as base
WORKDIR /app

FROM base AS install-prod
ENV PUPPETEER_SKIP_DOWNLOAD=1
COPY package.json yarn.lock ./
COPY apps/web/package.json apps/web/
COPY packages/common/package.json packages/common/
RUN yarn install --frozen-lockfile --production

COPY turbo.json ./


FROM install-prod AS install-dev
RUN yarn install

FROM install-dev AS build
COPY apps/web apps/web/
COPY packages/common packages/common/
RUN yarn build
# RUN bin/update-buildinfo.sh
# RUN yarn run prisma generate && bun run build

FROM node:22-slim AS release
WORKDIR /app
COPY --from=install-prod /app/node_modules node_modules
COPY --from=build /app/apps/web/build-server /app
COPY --from=build /app/apps/web/build /app/build
RUN mv index.js index.mjs
RUN mv index.js.map index.mjs.map
# COPY ./src/server /app/src/server
# COPY ./src/common /app/src/common
# COPY ./src/scripts /app/src/scripts
# COPY ./prisma /app/prisma
# COPY ./package.json /app
# COPY ./tsconfig.json /app
# COPY ./tsconfig.node.json /app
COPY ./apps/web/docker/entrypoint.sh /app/docker/
# COPY ./prisma /app/

ENTRYPOINT [ "/app/docker/entrypoint.sh" ]
