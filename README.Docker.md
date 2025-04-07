## To create images
might be needed (should be already in pnpm-lock.yaml)
`pnpm install --no-frozen-lockfile`


`docker build . --target ex-mic-1 --tag ex-mic-1:latest`
`docker build . --target ex-mic-2 --tag ex-mic-2:latest`

`docker compose up --build`
