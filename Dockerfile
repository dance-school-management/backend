FROM node:22.14-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=ex-mic-1 --prod /prod/ex-mic-1
RUN pnpm deploy --filter=ex-mic-2 --prod /prod/ex-mic-2

FROM base AS ex-mic-1
COPY --from=build /prod/ex-mic-1 /prod/ex-mic-1
WORKDIR /prod/ex-mic-1
EXPOSE 8000
CMD [ "pnpm", "start" ]

FROM base AS ex-mic-2
COPY --from=build /prod/ex-mic-2 /prod/ex-mic-2
WORKDIR /prod/ex-mic-2
EXPOSE 8001
CMD [ "pnpm", "start" ]