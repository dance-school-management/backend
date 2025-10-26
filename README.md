# README INFO

1. In every microservice you need .env.development with exact same items like in .env.development.example :) You can use script ```copy-envs-dev.sh```.

> [!NOTE]
You can use script ```bash compare-envs.sh``` (needs to be run with ```bash```, not ```sh```) to compare  ```.env.development``` and ```.env.development.example``` in each microservice.

2. You need "db" folder with files:

- auth-db-password.txt
- product-db-password.txt
- enroll-db-password.txt
- profile-db-password.txt
- notification-db-password.txt

You can use script ```create-files-with-db-password.sh```. It creates each of these files only if it doesn't exist and it fills them with content ```postgres```

1. To make gRPC work use script `generate-files-from-protos.sh` for macOS/linux, for windows use `generate-files-from-protos-Windows.sh`
2. There has to be at least one migration for microservices locally. It is a little bit tricky. You have to start all microservices' databases in docker and use `bash migrate-all-prismas.sh`.
3. To start all microservices - `run-docker-compose.sh`
4. To setup stripe TEST payments locally:
   1. Create a stripe account
   2. In the stripe dashboard, find the TEST api key and paste it into .env.development of enroll-microservice
   3. Install the stripe CLI. This is a simple CLI app. For example on the macOS it can be installed through homebrew. You can also install it with ```npm i -g stripe```.
   4. Use command ```stripe listen --forward-to localhost:8000/enroll/stripe/webhook```
   5. Copy the stripe webhook secret from the terminal and paste it into .env.development in enroll-microservice

You can find swagger docs at:

- localhost:8000/product/api-docs
- localhost:8000/auth/1/api-docs
- localhost:8000/auth/2/api-docs
- localhost:8000/enroll/api-docs
- localhost:8000/profile/api-docs

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

> [!NOTE]
> To seed database run script `seed-databases.sh`. It clears all databases and runs particular `seed.ts`.

- Careful! Auth seeding is related with profile-microservice. Remember about starting all needed docker's containers.
- Remember to create "uploads" folder if isn't there. It is used by muter for uploading photo.

## Kubernetes [In progress]

- For now there is a basic configuration creating 2 pods of api-gateway. For dev-purposes skaffold.yaml can be used `skaffold dev`. You will need to have skaffold, kustomize, minikube installed. k9s would also be handy.
