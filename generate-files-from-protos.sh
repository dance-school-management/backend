#!/usr/bin/env bash
(cd product-microservice && bash proto/build.sh)
(cd auth-microservice && bash proto/build.sh)
(cd enroll-microservice && bash proto/build.sh)
(cd profile-microservice && bash proto/build.sh)