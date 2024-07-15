# prisma generate fails on docker: https://github.com/prisma/prisma/issues/21241#issuecomment-1860605624
FROM node:22 as base
WORKDIR /app

FROM base AS install-prod
ENV PUPPETEER_SKIP_DOWNLOAD TRUE
COPY package.json yarn.lock ./
COPY apps/pdf/package.json apps/pdf/
COPY packages/common/package.json packages/common/
RUN yarn install --frozen-lockfile --production

COPY turbo.json ./


FROM install-prod AS install-dev
RUN yarn install

FROM install-dev AS build
COPY apps/pdf apps/pdf/
COPY packages/common packages/common/
RUN yarn build
# RUN bin/update-buildinfo.sh
# RUN yarn run prisma generate && bun run build


FROM node:22-slim

RUN apt-get update \
  && apt-get install -y wget gnupg ffmpeg \
  && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome




COPY --from=install-prod /app/node_modules node_modules
COPY --from=build /app/apps/pdf/dist /app
COPY --from=build /app/node_modules/@easy-kmu/common node_modules/@easy-kmu/common
COPY apps/pdf/templates/ /app/templates
COPY apps/pdf/bin /app/bin
RUN mkdir -p /app/templates/common/ && cp -r /app/node_modules/@fontsource/* /app/templates/common/
RUN mv index.js index.mjs
RUN mv index.js.map index.mjs.map
# COPY ./src/server /app/src/server
# COPY ./src/common /app/src/common
# COPY ./src/scripts /app/src/scripts
# COPY ./prisma /app/prisma
# COPY ./package.json /app
# COPY ./tsconfig.json /app
# COPY ./tsconfig.node.json /app
COPY ./apps/pdf/docker/entrypoint.sh /app/docker/


RUN groupadd -r -g 10001 pdfservice && useradd -r -u 10001 -g pdfservice -G audio,video pdfservice \
  && mkdir -p /home/pdfservice  \
  && chown -R pdfservice:pdfservice /home/pdfservice
# && chown -R pdfservice:pdfservice /app

USER pdfservice

# COPY ./prisma /app/
ENTRYPOINT [ "/app/docker/entrypoint.sh" ]

