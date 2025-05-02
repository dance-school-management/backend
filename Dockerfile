FROM node:22.14-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm install --filter api-gateway --filter=product-microservice
RUN pnpm deploy --filter=api-gateway /prod/api-gateway
RUN pnpm deploy --filter=product-microservice /prod/product-microservice

FROM base AS api-gateway
COPY --from=build /prod/api-gateway /prod/api-gateway
WORKDIR /prod/api-gateway
EXPOSE 8000
CMD [ "pnpm", "start:dev" ]

FROM base AS product-microservice
COPY --from=build /prod/product-microservice /prod/product-microservice
WORKDIR /prod/product-microservice
EXPOSE 8001
CMD ["sh", "-c", "pnpm db:deploy && pnpm start:dev"]