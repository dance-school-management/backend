# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

FROM base AS deps


COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY prisma ./prisma
RUN npx prisma generate

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base AS final

ENV NODE_ENV=production

COPY --from=deps /usr/src/app/generated ./generated
COPY package.json .
COPY --from=build /usr/src/app/dist ./dist
COPY prisma ./prisma
COPY proto ./proto
RUN npm ci --only=production

RUN chown -R node:node .
USER node

EXPOSE 8001
EXPOSE 50051

CMD ["npm", "run", "start"]
