# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

FROM base AS deps


COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY prisma ./prisma
RUN npx prisma generate --generator client

FROM base AS final

ENV NODE_ENV=development

COPY --from=deps /usr/src/app/generated ./generated
COPY src ./src
COPY tsconfig.json .
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY prisma ./prisma
COPY proto ./proto

# RUN chown -R node:node .
# USER node

EXPOSE 8004
EXPOSE 50051

CMD ["npm", "run", "start:dev"]