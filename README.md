# README INFO

1. In every microservice you need .env.development with exact same items like in .env.development.example :)
2. You need "db" folder with files:

- auth-db-password.txt
- product-db-password.txt
- enroll-db-password.txt
- profile-db-password.txt

3. To make gRPC work use script `generate-files-from-protos.sh` for macOS/linux, for windows use ...
4. There has to be at least one migration for microservices locally. It is a little bit tricky. You have to start all microservices' databases in docker and use `bash migrate-all-prismas.sh`.
5. To start all microservices - `docker compose -f 'docker-compose-dev.yml' up --build`
6. Developing gRPC - for each microservice use build.sh in proto folder