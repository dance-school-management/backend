#!/usr/bin/env bash
cd ..
(cd product-microservice && bash clear.sh)
(cd auth-microservice && bash clear.sh)
(cd enroll-microservice && bash clear.sh)
(cd profile-microservice && bash clear.sh)
(cd notification-microservice && bash clear.sh)
(cd blog-microservice && bash clear.sh)