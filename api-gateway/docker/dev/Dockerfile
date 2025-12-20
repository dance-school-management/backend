# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

FROM base AS final

ENV NODE_ENV=development

COPY src ./src
COPY tsconfig.json .
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules

# RUN chown -R node:node .
# USER node

EXPOSE 8000

CMD ["npm", "run", "start:dev"]