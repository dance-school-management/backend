# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

FROM base AS deps


RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM base AS final

ENV NODE_ENV=production

USER node

COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY ./dist/ ./dist

EXPOSE 8003

CMD ["node", "dist/index.js"]
