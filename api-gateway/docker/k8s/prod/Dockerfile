# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base AS final

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY tsconfig.json .
COPY --from=build /usr/src/app/dist ./dist

USER node

EXPOSE 8000

CMD ["npm", "run", "start"]
