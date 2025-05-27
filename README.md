# README INFO

1. In every microservice you need .env.development with exact same items like in .env.development.example :)
2. You need "db" folder with files:

- auth-db-password.txt
- product-db-password.txt
- enroll-db-password.txt
- profile-db-password.txt

3. To make gRPC work use script `generate-files-from-protos.sh` for macOS/linux, for windows use `generate-files-from-protos-Windows.sh`
4. There has to be at least one migration for microservices locally. It is a little bit tricky. You have to start all microservices' databases in docker and use `bash migrate-all-prismas.sh`.
5. To start all microservices - `docker compose -f 'docker-compose-dev.yml' up --build`

You can find swagger docs at:

- localhost:8000/product/api-docs
- localhost:8000/auth/api-docs
- localhost:8000/enroll/api-docs

Authentication (2 places):

1. In Api gateway for choosen paths you have to provide middleware if you want to authenticate user.
2. Through headers is sent information about user to microservice. Based on that you can provide for each route, endpoint middleware which checks role

Development mode (auth):

1. To disable authentication set env variable `AUTH_FLAG` to `false` in api-gateway .
2. Directly in `api-gateway/src/middlewares/authenticate.ts` you can change user data:

```ts
//...
  if (AUTH_FLAG === "false") {
        const fakeUser = {
          id: "provided-fake-id-string124",
          role: "STUDENT",
        };
        req.headers["user-context"] = Buffer.from(
          JSON.stringify(fakeUser)
        ).toString("base64");
        next();
  }
//...
```

## Seeding databases
> [!WARNING]
> When running `seed-databases.sh` be careful about `sleep` value. If problems occured adjust its value

- remember to create "uploads" folder if isn't there