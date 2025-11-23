#!/usr/bin/env bash
cd ..
(cd product-microservice && bash migrate.sh)
(cd auth-microservice && bash migrate.sh)
(cd enroll-microservice && bash migrate.sh)
(cd profile-microservice && bash migrate.sh)
(cd notification-microservice && bash migrate.sh)
(cd blog-microservice && bash migrate.sh)